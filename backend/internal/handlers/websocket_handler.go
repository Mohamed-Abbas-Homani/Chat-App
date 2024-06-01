package handlers

import (
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/Mohamed-Abbas-Homani/chat-app/internal/config"
	"github.com/Mohamed-Abbas-Homani/chat-app/internal/middlewares"
	"github.com/Mohamed-Abbas-Homani/chat-app/internal/models"
	"github.com/Mohamed-Abbas-Homani/chat-app/internal/repositories"
	"github.com/gorilla/websocket"
	"gorm.io/gorm"
)

// Client represents a single WebSocket connection with a user
type Client struct {
	conn   *websocket.Conn
	userID uint
}

// WebSocketHandler handles WebSocket connections
type WebSocketHandler struct {
	cfg         *config.AppConfig
	db          *gorm.DB
	clients     map[*Client]bool
	broadcast   chan models.Message
	userRepo    *repositories.UserRepository
	messageRepo *repositories.MessageRepository
	groupRepo   *repositories.GroupRepository
	mu          sync.Mutex
}

func NewWebSocketHandler(cfg *config.AppConfig, db *gorm.DB) *WebSocketHandler {
	return &WebSocketHandler{
		cfg:         cfg,
		db:          db,
		clients:     make(map[*Client]bool),
		broadcast:   make(chan models.Message, 100), // Buffer size can be configured
		userRepo:    repositories.NewUserRepository(db),
		messageRepo: repositories.NewMessageRepository(db),
		groupRepo:   repositories.NewGroupRepository(db),
	}
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// HandleWebSocket handles WebSocket connection requests
func (h *WebSocketHandler) HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("WebSocket upgrade error: %v", err)
		return
	}

	userID := r.Context().Value(middlewares.UserIDKey).(uint)
	client := &Client{conn: conn, userID: userID}
	h.registerClient(client)

	defer func() {
		h.unregisterClient(client)
		conn.Close()
	}()

	h.sendChatHistory(client)
	h.listenForMessages(client)
}

func (h *WebSocketHandler) registerClient(client *Client) {
	h.mu.Lock()
	h.clients[client] = true
	h.mu.Unlock()

	log.Printf("User %d connected", client.userID)
	h.updateUserStatus(client.userID, "Online")
	h.broadcastSystemMessage(client.userID, "Online", "")
}

func (h *WebSocketHandler) unregisterClient(client *Client) {
	h.mu.Lock()
	delete(h.clients, client)
	h.mu.Unlock()

	log.Printf("User %d disconnected", client.userID)
	lastSeen := h.updateUserStatus(client.userID, "Offline")
	h.broadcastSystemMessage(client.userID, "Offline", lastSeen)
}

func (h *WebSocketHandler) updateUserStatus(userID uint, status string) string {
	user, err := h.userRepo.GetUserByID(userID)
	if err != nil {
		log.Printf("Failed to find user: %v", err)
		return ""
	}

	user.Status = status
	if status == "Offline" {
		user.LastSeen = time.Now()
	}

	if err := h.userRepo.UpdateUser(user); err != nil {
		log.Printf("Failed to update user status: %v", err)
	}
	log.Printf("Updated user %d status to %s", userID, status)
	return user.LastSeen.Format(time.RFC3339)
}

func (h *WebSocketHandler) broadcastSystemMessage(userID uint, content, lastSeen string) {
	msg := models.Message{
		Content:     content,
		SenderID:    userID,
		MessageType: models.MessageTypeSystem,
		Status:      lastSeen,
	}
	h.broadcast <- msg
}

func (h *WebSocketHandler) sendChatHistory(client *Client) {
	messages, err := h.messageRepo.GetChatHistory(client.userID)
	if err != nil {
		log.Printf("Failed to load chat history: %v", err)
		return
	}
	for _, msg := range messages {
		if err := client.conn.WriteJSON(msg); err != nil {
			log.Printf("Failed to send chat history: %v", err)
			return
		}
	}
	log.Printf("Sent chat history to user %d", client.userID)
}

func (h *WebSocketHandler) listenForMessages(client *Client) {
	for {
		var msg models.Message
		if err := client.conn.ReadJSON(&msg); err != nil {
			log.Printf("WebSocket read error: %v", err)
			break
		}

		log.Printf("Received message from user %d: %s", client.userID, msg.Content)

		switch msg.MessageType {
		case models.MessageTypeChat:
			h.handleChatMessage(client, &msg)
		case models.MessageTypeSystem:
			h.handleSystemMessage(client, &msg)
		case models.MessageTypeStatus:
			h.handleStatusMessage(&msg)
		}
	}
}

func (h *WebSocketHandler) handleChatMessage(client *Client, msg *models.Message) {
	log.Println("Handling Chat message")
	msg.SenderID = client.userID
	msg.Status = "sent"
	if err := h.messageRepo.CreateMessage(msg); err != nil {
		log.Printf("Failed to save message: %v", err)
		return
	}

	log.Printf("Message from user %d saved to database", client.userID)
	if msg.SenderID != msg.RecipientID {
		h.sendMessageToRecipient(*msg, msg.SenderID)
	}
	if msg.RecipientID != 0 {
		h.sendMessageToRecipient(*msg, msg.RecipientID)
	} else if msg.GroupID != 0 {
		h.sendMessageToGroup(*msg)
	} else {
		h.broadcast <- *msg
	}
}

func (h *WebSocketHandler) handleSystemMessage(client *Client, msg *models.Message) {
	log.Println("Handling System message")
	msg.SenderID = client.userID
	if msg.RecipientID != 0 {
		h.sendMessageToRecipient(*msg, msg.RecipientID)
	} else if msg.GroupID != 0 {
		h.sendMessageToGroup(*msg)
	}
}

func (h *WebSocketHandler) handleStatusMessage(msg *models.Message) {
	log.Println("Handling Status message")
	if msg.Status == "delivered" {
		msg.MessageType = models.MessageTypeChat
		if err := h.messageRepo.UpdateMessage(msg); err != nil {
			log.Printf("Failed to update message: %v", err)
			return
		}
		msg.RecipientID = msg.SenderID
		msg.MessageType = models.MessageTypeStatus
		h.sendMessageToRecipient(*msg, msg.RecipientID)
	} else {
		h.messageRepo.MarkMessagesAsSeen(msg.SenderID, msg.RecipientID)
		temp := msg.RecipientID
		msg.RecipientID = msg.SenderID
		msg.SenderID = temp
		h.sendMessageToRecipient(*msg, msg.RecipientID)
	}
}

func (h *WebSocketHandler) Start() {
	for msg := range h.broadcast {
		log.Printf("Broadcasting message: %s", msg.Content)
		h.mu.Lock()
		for client := range h.clients {
			if err := client.conn.WriteJSON(msg); err != nil {
				log.Printf("WebSocket write error: %v", err)
				client.conn.Close()
				delete(h.clients, client)
			}
		}
		h.mu.Unlock()
	}
}

func (h *WebSocketHandler) sendMessageToRecipient(msg models.Message, recipientID uint) {
	h.mu.Lock()
	defer h.mu.Unlock()
	for client := range h.clients {
		if client.userID == recipientID {
			if err := client.conn.WriteJSON(msg); err != nil {
				log.Printf("WebSocket write error: %v", err)
				client.conn.Close()
				delete(h.clients, client)
			}
			log.Printf("Sent message %s of status %s to recipient %d", msg.MessageType, msg.Status, recipientID)
		}
	}
}

func (h *WebSocketHandler) sendMessageToGroup(msg models.Message) {
	group, err := h.groupRepo.GetGroupByID(msg.GroupID)
	if err != nil {
		log.Printf("Failed to find group: %v", err)
		return
	}

	h.mu.Lock()
	defer h.mu.Unlock()
	for _, member := range group.Users {
		for client := range h.clients {
			if client.userID == member.ID {
				if err := client.conn.WriteJSON(msg); err != nil {
					log.Printf("WebSocket write error: %v", err)
					client.conn.Close()
					delete(h.clients, client)
				}
				log.Printf("Sent message to group member %d", member.ID)
			}
		}
	}
}

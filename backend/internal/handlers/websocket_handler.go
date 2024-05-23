package handlers

import (
	"fmt"
	"log"
	"net/http"
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
}

func NewWebSocketHandler(cfg *config.AppConfig, db *gorm.DB) *WebSocketHandler {
	return &WebSocketHandler{
		cfg:         cfg,
		db:          db,
		clients:     make(map[*Client]bool),
		broadcast:   make(chan models.Message),
		userRepo:    repositories.NewUserRepository(db),
		messageRepo: repositories.NewMessageRepository(db),
	}
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

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
	h.clients[client] = true
	log.Printf("User %d connected", client.userID)
	h.updateUserStatus(client.userID, true)
	h.broadcastSystemMessage(fmt.Sprintf("User %d connected", client.userID))
}

func (h *WebSocketHandler) unregisterClient(client *Client) {
	delete(h.clients, client)
	log.Printf("User %d disconnected", client.userID)
	h.updateUserStatus(client.userID, false)
	h.broadcastSystemMessage(fmt.Sprintf("User %d disconnected", client.userID))
}

func (h *WebSocketHandler) updateUserStatus(userID uint, online bool) {
	user := models.User{}
	if err := h.db.First(&user, userID).Error; err != nil {
		log.Printf("Failed to find user: %v", err)
		return
	}

	user.Online = online
	if !online {
		user.LastSeen = time.Now()
	}

	if err := h.db.Save(&user).Error; err != nil {
		log.Printf("Failed to update user status: %v", err)
	}
	log.Printf("Updated user %d status to %t", userID, online)
}

func (h *WebSocketHandler) broadcastSystemMessage(content string) {
	msg := models.Message{
		Content:     content,
		SenderID:    0, // system message
		MessageType: models.MessageTypeSystem,
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

		msg.SenderID = client.userID
		msg.MessageType = models.MessageTypeChat

		if err := h.messageRepo.CreateMessage(&msg); err != nil {
			log.Printf("Failed to save message: %v", err)
			continue
		}

		log.Printf("Message from user %d saved to database", client.userID)

		if msg.RecipientID == 0 {
			h.broadcast <- msg
		} else {
			h.sendMessageToRecipient(msg)
		}
	}
}

func (h *WebSocketHandler) Start() {
	for {
		msg := <-h.broadcast
		log.Printf("Broadcasting message: %s", msg.Content)
		for client := range h.clients {
			if err := client.conn.WriteJSON(msg); err != nil {
				log.Printf("WebSocket write error: %v", err)
				client.conn.Close()
				delete(h.clients, client)
			}
		}
	}
}

func (h *WebSocketHandler) sendMessageToRecipient(msg models.Message) {
	for client := range h.clients {
		if client.userID == msg.RecipientID {
			if err := client.conn.WriteJSON(msg); err != nil {
				log.Printf("WebSocket write error: %v", err)
				client.conn.Close()
				delete(h.clients, client)
			}
			log.Printf("Sent message to recipient %d", msg.RecipientID)
			break
		}
	}
}

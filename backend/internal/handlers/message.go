package handlers

import (
	"net/http"
	"strconv"

	"github.com/Mohamed-Abbas-Homani/chat-app/internal/models"
	"github.com/Mohamed-Abbas-Homani/chat-app/internal/repositories"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type MessageHandler struct {
	db          *gorm.DB
	messageRepo *repositories.MessageRepository
	userRepo    *repositories.UserRepository
	groupRepo   *repositories.GroupRepository
}

func NewMessageHandler(db *gorm.DB, messageRepo *repositories.MessageRepository, userRepo *repositories.UserRepository, groupRepo *repositories.GroupRepository) *MessageHandler {
	return &MessageHandler{
		db:          db,
		messageRepo: messageRepo,
		userRepo:    userRepo,
		groupRepo:   groupRepo,
	}
}

// SendMessage handles sending a message
func (mh *MessageHandler) SendMessage(c *gin.Context) {
	var msg models.Message
	if err := c.ShouldBindJSON(&msg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	if err := mh.messageRepo.CreateMessage(&msg); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send message"})
		return
	}

	c.JSON(http.StatusCreated, msg)
}

// GetMessageByID retrieves a message by its ID
func (mh *MessageHandler) GetMessageByID(c *gin.Context) {
	messageID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid message ID"})
		return
	}

	message, err := mh.messageRepo.GetMessageByID(uint(messageID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Message not found"})
		return
	}

	c.JSON(http.StatusOK, message)
}

// GetMessagesByUser retrieves all messages for a specific user
func (mh *MessageHandler) GetMessagesByUser(c *gin.Context) {
	userID, err := strconv.ParseUint(c.Param("user_id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	messages, err := mh.messageRepo.GetMessagesByUserID(uint(userID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get messages"})
		return
	}

	c.JSON(http.StatusOK, messages)
}

// GetChatHistory retrieves the chat history between two users or for a group
func (mh *MessageHandler) GetChatHistory(c *gin.Context) {
	userID, err := strconv.ParseUint(c.Param("user_id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	messages, err := mh.messageRepo.GetChatHistory(uint(userID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get chat history"})
		return
	}

	c.JSON(http.StatusOK, messages)
}

// DeleteMessage handles deleting a message
func (mh *MessageHandler) DeleteMessage(c *gin.Context) {
	messageID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid message ID"})
		return
	}

	message, err := mh.messageRepo.GetMessageByID(uint(messageID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Message not found"})
		return
	}

	if err := mh.messageRepo.DeleteMessage(message); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete message"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Message deleted"})
}

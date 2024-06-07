package handlers

import (
	"net/http"
	"os"
	"path/filepath"
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
}

func NewMessageHandler(db *gorm.DB, messageRepo *repositories.MessageRepository, userRepo *repositories.UserRepository) *MessageHandler {
	return &MessageHandler{
		db:          db,
		messageRepo: messageRepo,
		userRepo:    userRepo,
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

// GetChatHistory retrieves the chat history between two users 
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

	// Attempt to delete the associated file if file path is present
	if message.FilePath != "" {
		absolutePath, err := filepath.Abs(message.FilePath)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to resolve file path"})
			return
		}

		if err := os.Remove(absolutePath); err != nil && !os.IsNotExist(err) {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete associated file"})
			return
		}
	}

	if err := mh.messageRepo.DeleteMessage(message); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete message"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Message and associated file deleted"})
}
package models

import (
	"gorm.io/gorm"
)

type MessageType string

const (
	MessageTypeChat    MessageType = "chat"
	MessageTypeSystem  MessageType = "system"
)

// Message represents a chat message.
type Message struct {
	gorm.Model
	Content     string      `json:"content"`
	SenderID    uint        `json:"sender_id"`
	RecipientID uint        `json:"recipient_id"`
	GroupID     uint        `json:"group_id"`
	MessageType MessageType `json:"message_type"`
}
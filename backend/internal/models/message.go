package models

import (
	"gorm.io/gorm"
)

type MessageType string

const (
	MessageTypeChat    MessageType = "chat"
	MessageTypeSystem  MessageType = "system"
	MessageTypeStatus MessageType = "status"
)

type MessageStatus string

const (
	MessageStatusSent     MessageStatus = "sent"
	MessageStatusDelivered MessageStatus = "delivered"
	MessageStatusSeen      MessageStatus = "seen"
)

// Message represents a chat message.
type Message struct {
	gorm.Model
	Content     string         `json:"content"`
	SenderID    uint           `json:"sender_id"`
	RecipientID uint           `json:"recipient_id"` // Single recipient
	GroupID     uint           `json:"group_id"`     // Group ID
	MessageType MessageType    `json:"message_type"`
	Status      MessageStatus  `json:"status"`
}

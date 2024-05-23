package models

import (
	"gorm.io/gorm"
)

type MessageType string

const (
	MessageTypeChat    MessageType = "chat"
	MessageTypeSystem  MessageType = "system"
)

type MessageStatus string

const (
	MessageStatusSent     MessageStatus = "sent"
	MessageStatusDelivered MessageStatus = "delivered"
	MessageStatusRead      MessageStatus = "read"
)

// Message represents a chat message.
type Message struct {
	gorm.Model
	Content     string         `json:"content"`
	SenderID    uint           `json:"sender_id"`
	Recipients  []*User        `gorm:"many2many:message_recipients" json:"recipients"`
	GroupID     uint           `json:"group_id"`
	MessageType MessageType    `json:"message_type"`
	Status      MessageStatus  `json:"status"`
}

package models

import (
	"gorm.io/gorm"
)

type MessageType string

const (
	MessageTypeChat   MessageType = "chat"
	MessageTypeSystem MessageType = "system"
	MessageTypeStatus MessageType = "status"
)

// Message represents a chat message.
type Message struct {
	gorm.Model
	Content     string      `json:"content"`
	SenderID    uint        `json:"sender_id"`
	RecipientID uint        `json:"recipient_id"` // Single recipient
	GroupID     uint        `json:"group_id"`     // Group ID
	MessageType MessageType `json:"message_type"`
	Status      string      `json:"status"`
	FilePath    string      `json:"file_path"`
	MediaType		string			`json:"media_type"`
}

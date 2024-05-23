package repositories

import (
	"github.com/Mohamed-Abbas-Homani/chat-app/internal/models"
	"gorm.io/gorm"
)

type MessageRepository struct {
	db *gorm.DB
}

func NewMessageRepository(db *gorm.DB) *MessageRepository {
	return &MessageRepository{db: db}
}

func (mr *MessageRepository) CreateMessage(message *models.Message) error {
	result := mr.db.Create(message)
	return result.Error
}

func (mr *MessageRepository) GetMessageByID(messageID uint) (*models.Message, error) {
	var message models.Message
	result := mr.db.First(&message, messageID)
	if result.Error != nil {
		return nil, result.Error
	}
	return &message, nil
}

func (mr *MessageRepository) GetMessagesByUserID(userID uint) ([]*models.Message, error) {
	var messages []*models.Message
	result := mr.db.
		Where("sender_id = ? OR recipient_id = ?", userID, userID).
		Find(&messages)
	if result.Error != nil {
		return nil, result.Error
	}
	return messages, nil
}

func (mr *MessageRepository) GetMessagesByGroupID(groupID uint) ([]*models.Message, error) {
	var messages []*models.Message
	result := mr.db.
		Where("group_id = ?", groupID).
		Find(&messages)
	if result.Error != nil {
		return nil, result.Error
	}
	return messages, nil
}

func (mr *MessageRepository) UpdateMessage(message *models.Message) error {
	result := mr.db.Save(message)
	return result.Error
}

func (mr *MessageRepository) DeleteMessage(message *models.Message) error {
	result := mr.db.Delete(message)
	return result.Error
}

func (mr *MessageRepository) GetChatHistory(userID uint) ([]models.Message, error) {
	var messages []models.Message
	err := mr.db.
		Where("sender_id = ? OR recipient_id = ?", userID, userID).
		Order("created_at ASC").Find(&messages).
		Error
	return messages, err
}

func (mr *MessageRepository) GetGroupChatHistory(groupID uint) ([]models.Message, error) {
	var messages []models.Message
	err := mr.db.
		Where("group_id = ?", groupID).
		Order("created_at ASC").Find(&messages).
		Error
	return messages, err
}

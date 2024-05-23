package repositories

import (
	"github.com/Mohamed-Abbas-Homani/chat-app/internal/models"
	"gorm.io/gorm"
)

type GroupRepository struct {
	db *gorm.DB
}

func NewGroupRepository(db *gorm.DB) *GroupRepository {
	return &GroupRepository{db: db}
}

func (gr *GroupRepository) CreateGroup(group *models.Group) error {
	result := gr.db.Create(group)
	return result.Error
}

func (gr *GroupRepository) GetGroupByID(groupID uint) (*models.Group, error) {
	var group models.Group
	result := gr.db.
		Preload("Users").
		First(&group, groupID)
	if result.Error != nil {
		return nil, result.Error
	}
	return &group, nil
}

func (gr *GroupRepository) GetAllGroups() ([]models.Group, error) {
	var groups []models.Group
	result := gr.db.
		Preload("Users").
		Find(&groups)
	if result.Error != nil {
		return nil, result.Error
	}
	return groups, nil
}

func (gr *GroupRepository) UpdateGroup(group *models.Group) error {
	result := gr.db.Save(group)
	return result.Error
}

func (gr *GroupRepository) DeleteGroup(group *models.Group) error {
	result := gr.db.Delete(group)
	return result.Error
}

func (gr *GroupRepository) AddUserToGroup(groupID uint, userID uint) error {
	group, err := gr.GetGroupByID(groupID)
	if err != nil {
		return err
	}

	user := &models.User{}
	if err := gr.db.
		First(user, userID).
		Error; err != nil {
		return err
	}

	return gr.db.
		Model(group).
		Association("Users").
		Append(user)
}

func (gr *GroupRepository) RemoveUserFromGroup(groupID uint, userID uint) error {
	group, err := gr.GetGroupByID(groupID)
	if err != nil {
		return err
	}

	user := &models.User{}
	if err := gr.db.
		First(user, userID).
		Error; err != nil {
		return err
	}

	return gr.db.
		Model(group).
		Association("Users").
		Delete(user)
}

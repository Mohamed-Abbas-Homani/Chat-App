package repositories

import (
	"github.com/Mohamed-Abbas-Homani/chat-app/internal/models"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (ur *UserRepository) CreateUser(user *models.User) error {
	result := ur.db.Create(user)
	return result.Error
}

func (ur *UserRepository) GetUserByID(userID uint) (*models.User, error) {
	var user models.User
	result := ur.db.
		Preload("Groups").
		First(&user, userID)
	if result.Error != nil {
		return nil, result.Error
	}
	return &user, nil
}

func (ur *UserRepository) GetUserByUsername(username string) (*models.User, error) {
	var user models.User
	result := ur.db.
		Preload("Groups").
		Where("username = ?", username).
		First(&user)
	if result.Error != nil {
		return nil, result.Error
	}
	return &user, nil
}

func (ur *UserRepository) GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	result := ur.db.
		Preload("Groups").
		Where("email = ?", email).
		First(&user)
	if result.Error != nil {
		return nil, result.Error
	}
	return &user, nil
}

func (ur *UserRepository) GetAllUsers() ([]models.User, error) {
	var users []models.User
	result := ur.db.
		Preload("Groups").
		Find(&users)
	if result.Error != nil {
		return nil, result.Error
	}
	return users, nil
}

func (ur *UserRepository) UpdateUser(user *models.User) error {
	result := ur.db.Save(user)
	return result.Error
}

func (ur *UserRepository) DeleteUser(user *models.User) error {
	result := ur.db.Delete(user)
	return result.Error
}

func (ur *UserRepository) AddUserToGroup(userID uint, groupID uint) error {
	user, err := ur.GetUserByID(userID)
	if err != nil {
		return err
	}

	group := &models.Group{}
	if err := ur.db.
		First(group, groupID).
		Error; err != nil {
		return err
	}

	return ur.db.
		Model(user).
		Association("Groups").
		Append(group)
}

func (ur *UserRepository) RemoveUserFromGroup(userID uint, groupID uint) error {
	user, err := ur.GetUserByID(userID)
	if err != nil {
		return err
	}

	group := &models.Group{}
	if err := ur.db.
		First(group, groupID).
		Error; err != nil {
		return err
	}

	return ur.db.
		Model(user).
		Association("Groups").
		Delete(group)
}

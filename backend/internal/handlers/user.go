package handlers

import (
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/Mohamed-Abbas-Homani/chat-app/internal/repositories"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type UserHandler struct {
	db             *gorm.DB
	userRepository *repositories.UserRepository
}

func NewUserHandler(db *gorm.DB, userRepository *repositories.UserRepository) *UserHandler {
	return &UserHandler{db: db, userRepository: userRepository}
}

// GetAllUsers handles the retrieval of all users
func (uh *UserHandler) GetAllUsers(c *gin.Context) {
	users, err := uh.userRepository.GetAllUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get users"})
		return
	}

	c.JSON(http.StatusOK, users)
}

// GetUserByID handles the retrieval of a user by ID
func (uh *UserHandler) GetUserByID(c *gin.Context) {
	userIDStr := c.Param("id")
	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	user, err := uh.userRepository.GetUserByID(uint(userID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// UpdateUser handles the update of an existing user
func (uh *UserHandler) UpdateUser(c *gin.Context) {
	r := c.Request
	r.ParseMultipartForm(10 << 20) // 10 MB max file size

	// Extract user ID from URL query parameters
	userIDStr := c.PostForm("id")
	if userIDStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing user ID"})
		return
	}

	// Convert userID from string to uint
	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	// Fetch user from the database
	user, err := uh.userRepository.GetUserByID(uint(userID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Update user fields if provided
	username := c.PostForm("username")
	if username != "" {
		user.Username = username
	}

	email := c.PostForm("email")
	if email != "" {
		user.Email = email
	}

	bio := c.PostForm("bio")
	if bio != "" {
		user.Bio = bio
	}

	// Handle profile picture update
	file, err := c.FormFile("profilePicture")
	if err != nil && err != http.ErrMissingFile {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error retrieving the file"})
		return
	}
	if err == nil {
		// Save the file to the server
		tempFile, err := os.Create(filepath.Join("uploads", file.Filename))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error saving the file"})
			return
		}
		defer tempFile.Close()
		fileContent, err := file.Open()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error opening the file"})
			return
		}
		defer fileContent.Close()
		_, err = io.Copy(tempFile, fileContent)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error saving the file"})
			return
		}
		profilePicturePath := tempFile.Name()
		user.ProfilePicture = profilePicturePath
	}

	// Update user in the database
	if err := uh.userRepository.UpdateUser(user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// DeleteUser handles the deletion of an existing user
func (uh *UserHandler) DeleteUser(c *gin.Context) {
	userIDStr := c.Param("id")
	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	user, err := uh.userRepository.GetUserByID(uint(userID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if err := uh.userRepository.DeleteUser(user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

// GetUserByUsername handles the retrieval of a user by username
func (uh *UserHandler) GetUserByUsername(c *gin.Context) {
	username := c.Param("username")
	user, err := uh.userRepository.GetUserByUsername(username)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// GetUserByEmail handles the retrieval of a user by email
func (uh *UserHandler) GetUserByEmail(c *gin.Context) {
	email := c.Param("email")
	user, err := uh.userRepository.GetUserByEmail(email)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// UploadFile handles uploading any type of file and storing it in the uploads/files/ directory
func (uh *UserHandler) UploadFile(c *gin.Context) {
	r := c.Request
	r.ParseMultipartForm(10 << 20) // 10 MB max file size

	// Retrieve the file from the request
	file, err := c.FormFile("file")
	if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Error retrieving the file"})
			return
	}

	// Create the uploads/files directory if it doesn't exist
	uploadPath := "uploads/files"
	if err := os.MkdirAll(uploadPath, os.ModePerm); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating upload directory"})
			return
	}

	// Save the file to the server
	tempFile, err := os.Create(filepath.Join(uploadPath, file.Filename))
	if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error saving the file"})
			return
	}
	defer tempFile.Close()
	
	fileContent, err := file.Open()
	if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error opening the file"})
			return
	}
	defer fileContent.Close()
	
	_, err = io.Copy(tempFile, fileContent)
	if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error saving the file"})
			return
	}

	c.JSON(http.StatusOK, gin.H{"message": "File uploaded successfully", "filePath": tempFile.Name()})
}

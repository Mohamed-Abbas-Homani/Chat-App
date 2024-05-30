package handlers

import (
    "net/http"
    "path/filepath"
    "time"

    "github.com/gin-gonic/gin"
    "github.com/Mohamed-Abbas-Homani/chat-app/internal/config"
    "github.com/Mohamed-Abbas-Homani/chat-app/internal/models"
    "github.com/Mohamed-Abbas-Homani/chat-app/internal/repositories"
    "github.com/golang-jwt/jwt/v5"
    "golang.org/x/crypto/bcrypt"
    "gorm.io/gorm"
)

type AuthHandler struct {
    db        *gorm.DB
    userRepo  *repositories.UserRepository
    jwtConfig config.JWTConfig
}

func NewAuthHandler(db *gorm.DB, userRepo *repositories.UserRepository, jwtConfig config.JWTConfig) *AuthHandler {
    return &AuthHandler{
        db:        db,
        userRepo:  userRepo,
        jwtConfig: jwtConfig,
    }
}

// SignUp handles user registration
func (ah *AuthHandler) SignUp(c *gin.Context) {
    username := c.PostForm("username")
    email := c.PostForm("email")
    password := c.PostForm("password")

    // Validate email format
    if !isValidEmail(email) {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email format"})
        return
    }

    // Check if username already exists
    if _, err := ah.userRepo.GetUserByUsername(username); err == nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Username already exists"})
        return
    }

    // Check if email already exists
    if _, err := ah.userRepo.GetUserByEmail(email); err == nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Email already exists"})
        return
    }

    // Handle profile picture
    var profilePicturePath string
    file, err := c.FormFile("profilePicture")
    if err == nil {
        profilePicturePath = filepath.Join("uploads", file.Filename)
        if err := c.SaveUploadedFile(file, profilePicturePath); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Error saving the file"})
            return
        }
    } else {
        // Use default profile picture if none is provided
        profilePicturePath = "uploads/default.jpg"
    }

    // Hash the password
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error hashing password"})
        return
    }

    user := &models.User{
        Username:       username,
        Email:          email,
        Password:       string(hashedPassword),
        ProfilePicture: profilePicturePath,
    }

    if err := ah.userRepo.CreateUser(user); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating user"})
        return
    }

    c.JSON(http.StatusCreated, user)
}

// Login handles user authentication
func (ah *AuthHandler) Login(c *gin.Context) {
    var credentials struct {
        Email    string `json:"email" binding:"required"`
        Password string `json:"password" binding:"required"`
    }
    if err := c.ShouldBindJSON(&credentials); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
        return
    }

    // Find the user by email
    user, err := ah.userRepo.GetUserByEmail(credentials.Email)
    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
        return
    }

    // Compare the hashed password with the password provided
    if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(credentials.Password)); err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
        return
    }

    // Generate JWT token
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "userID": user.ID,
        "exp":    time.Now().Add(time.Hour * 24).Unix(), // Token expires after 24 hours
    })

    tokenString, err := token.SignedString([]byte(ah.jwtConfig.SecretKey))
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error generating token"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "token": tokenString,
        "user":  user,
    })
}

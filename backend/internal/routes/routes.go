package routes

import (
	"net/http"

	"github.com/Mohamed-Abbas-Homani/chat-app/internal/config"
	"github.com/Mohamed-Abbas-Homani/chat-app/internal/handlers"
	"github.com/Mohamed-Abbas-Homani/chat-app/internal/middlewares"
	"github.com/Mohamed-Abbas-Homani/chat-app/internal/repositories"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(router *gin.Engine, cfg *config.AppConfig, db *gorm.DB) {
	// Initialize repositories
	userRepository := repositories.NewUserRepository(db)
	messageRepository := repositories.NewMessageRepository(db)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(db, userRepository, cfg.JWT)
	wsHandler := handlers.NewWebSocketHandler(cfg, db)
	userHandler := handlers.NewUserHandler(db, userRepository)
	messageHandler := handlers.NewMessageHandler(db, messageRepository, userRepository)

	router.Use(middlewares.CORSMiddleware())

	// Auth routes
	authRoutes := router.Group("/auth")
	{
		authRoutes.POST("/signup", authHandler.SignUp)
		authRoutes.POST("/login", authHandler.Login)
	}

	// User routes with AuthMiddleware
	userRoutes := router.Group("/user")
	userRoutes.Use(middlewares.AuthMiddleware(cfg))
	{
		userRoutes.GET("/", userHandler.GetAllUsers)
		userRoutes.GET("/:id", userHandler.GetUserByID)
		userRoutes.PUT("/:id", userHandler.UpdateUser)
		userRoutes.DELETE("/:id", userHandler.DeleteUser)
		userRoutes.POST("/upload", userHandler.UploadFile) // New route for uploading files
	}

	// Message routes with AuthMiddleware
	messageRoutes := router.Group("/message")
	messageRoutes.Use(middlewares.AuthMiddleware(cfg))
	{
		messageRoutes.POST("/", messageHandler.SendMessage)
		messageRoutes.GET("/:id", messageHandler.GetMessageByID)
		messageRoutes.GET("/chat/:user_id", messageHandler.GetChatHistory)
		messageRoutes.DELETE("/:id", messageHandler.DeleteMessage)
	}

	http.Handle("/ws", middlewares.WsAuthMiddleware(cfg.JWT, true)(http.HandlerFunc(wsHandler.HandleWebSocket)))

	// Serve static files from the "./uploads" directory
	router.Static("/uploads", "./uploads")

	// Start WebSocket broadcast goroutine
	go wsHandler.Start()
}

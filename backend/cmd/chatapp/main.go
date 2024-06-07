package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/Mohamed-Abbas-Homani/chat-app/internal/config"
	"github.com/Mohamed-Abbas-Homani/chat-app/internal/models"
	"github.com/Mohamed-Abbas-Homani/chat-app/internal/routes"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// Load application configurations
	cfg := config.LoadConfig()

	// Initialize database connection
	db, err := gorm.Open(postgres.Open(cfg.DB.ConnectionURL()), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Migrate the models
	err = db.AutoMigrate(&models.User{}, &models.Message{})
	if err != nil {
		log.Fatalf("Failed to migrate models: %v", err)
	}

	// Set up Gin router and initialize handlers
	router := gin.Default()
	routes.SetupRoutes(router, &cfg, db)

	// Start HTTP server
	go func() {
		if err := router.Run(":" + cfg.WS.Port); err != nil {
			log.Fatalf("Server failed to start: %v", err)
		}
	}()

	// Start WebSocket HTTP server
	go func() {
		fmt.Printf("Server is running at http://localhost:%s\n", cfg.WS.WsPort)
		if err := http.ListenAndServe(":"+cfg.WS.WsPort, nil); err != nil {
			log.Fatalf("Server failed to start: %v", err)
		}
	}()

	// Graceful shutdown
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop
	fmt.Println("\nShutting down server...")
}

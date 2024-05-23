package utils

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func ExtractTokenFromHeaderGin(c *gin.Context) (string, bool) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is missing"})
		return "", false
	}

	bearerToken := strings.Split(authHeader, " ")
	if len(bearerToken) != 2 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header format is invalid"})
		return "", false
	}

	return bearerToken[1], true
}

func ExtractTokenFromURLGin(c *gin.Context) (string, bool) {
	token := c.Query("token")
	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Token is missing from URL"})
		return "", false
	}

	return token, true
}

func ExtractTokenFromHeader(w http.ResponseWriter,r *http.Request) (string, bool) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
			http.Error(w, "Authorization header required", http.StatusUnauthorized)
			return "", false
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	if tokenString == authHeader {
			http.Error(w, "Invalid authorization token", http.StatusUnauthorized)
			return "", false
	}

	return tokenString, true
}

func ExtractTokenFromURL(w http.ResponseWriter,r *http.Request) (string, bool) {
	tokenString := r.URL.Query().Get("token")
	if tokenString == "" {
			http.Error(w, "Token query parameter required", http.StatusUnauthorized)
			return "", false
	}

	return tokenString, true
}
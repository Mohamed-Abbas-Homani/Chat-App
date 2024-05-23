package middlewares

import (
	"net/http"

	"github.com/Mohamed-Abbas-Homani/chat-app/internal/config"
	"github.com/Mohamed-Abbas-Homani/chat-app/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type key string

const UserIDKey key = "userID"

func AuthMiddleware(jwtConfig config.JWTConfig, fromURL bool) gin.HandlerFunc {
	return func(c *gin.Context) {
		var tokenString string
		var ok bool
		if !fromURL {
			tokenString, ok = utils.ExtractTokenFromHeaderGin(c)
		} else {
			tokenString, ok = utils.ExtractTokenFromURLGin(c)
		}

		if !ok {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return []byte(jwtConfig.SecretKey), nil
		})
		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization token"})
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization token"})
			return
		}

		userID := claims["userID"].(float64)
		c.Set(string(UserIDKey), uint(userID))

		c.Next()
	}
}

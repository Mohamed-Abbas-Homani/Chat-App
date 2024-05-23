package middlewares

import (
	"context"
	"net/http"

	"github.com/Mohamed-Abbas-Homani/chat-app/internal/config"
	"github.com/Mohamed-Abbas-Homani/chat-app/internal/utils"

	"github.com/golang-jwt/jwt/v5"
)

func WsAuthMiddleware(jwtConfig config.JWTConfig, fromURL bool) func(http.Handler) http.Handler {
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            var tokenString string
            var ok bool
            if !fromURL {
                tokenString, ok = utils.ExtractTokenFromHeader(w, r)
            } else {
                tokenString, ok = utils.ExtractTokenFromURL(w, r)
            }
            
            if !ok {
                return
            }

            token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
                return []byte(jwtConfig.SecretKey), nil
            })
            if err != nil || !token.Valid {
                http.Error(w, "Invalid authorization token", http.StatusUnauthorized)
                return
            }

            claims, ok := token.Claims.(jwt.MapClaims)
            if !ok || !token.Valid {
                http.Error(w, "Invalid authorization token", http.StatusUnauthorized)
                return
            }

            userID := claims["userID"].(float64)
            ctx := context.WithValue(r.Context(), UserIDKey, uint(userID))
            r = r.WithContext(ctx)

            next.ServeHTTP(w, r)
        })
    }
}

package utils

import (
	"net/http"
	"strings"
)

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
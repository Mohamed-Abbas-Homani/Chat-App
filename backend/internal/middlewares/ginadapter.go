package middlewares

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// GinHandlerFuncAdapter converts an http.HandlerFunc to a gin.HandlerFunc
func GinHandlerFuncAdapter(f http.HandlerFunc) gin.HandlerFunc {
	return func(c *gin.Context) {
		f(c.Writer, c.Request)
	}
}

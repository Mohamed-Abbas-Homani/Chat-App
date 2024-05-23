package models

import (
	"gorm.io/gorm"
	"time"
)

// User represents a registered user in the system.
type User struct {
	gorm.Model
	Username       string    `gorm:"unique;not null" json:"username" binding:"required"` // Username of the user, must be unique and not null
	Email          string    `gorm:"unique;not null" json:"email" binding:"required"`    // Email of the user, must be unique and not null
	Password       string    `gorm:"not null" json:"password" binding:"required"`        // Password of the user, must be not null
	LastSeen       time.Time `json:"last_seen"`                                          // Timestamp of the user's last activity
	Online         bool      `json:"online"`                                             // Indicates if the user is currently online
	ProfilePicture string    `json:"profile_picture"`                                    // Path to the user's profile picture
	Bio            string    `json:"bio"`                                                // Bio of the user
	Groups         []*Group  `gorm:"many2many:user_groups;"`                             // Groups that the user belongs to
}

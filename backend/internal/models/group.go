package models

import "gorm.io/gorm"

// Group represents a group of users.
type Group struct {
	gorm.Model
	Name        string   `gorm:"unique;not null" json:"name" binding:"required"` // Name of the group, must be unique and not null
	Description string   `json:"description"`                                    // Description of the group
	AdminID     uint     `json:"admin_id"`                                       // ID of the admin user
	Admin       User     `gorm:"foreignkey:AdminID"`                             // Admin user
	Users       []*User  `gorm:"many2many:user_groups;"`                         // Group's users
}

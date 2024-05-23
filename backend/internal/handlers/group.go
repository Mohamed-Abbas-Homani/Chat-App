package handlers

import (
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
    "github.com/Mohamed-Abbas-Homani/chat-app/internal/models"
    "github.com/Mohamed-Abbas-Homani/chat-app/internal/repositories"
    "gorm.io/gorm"
)

type GroupHandler struct {
    db        *gorm.DB
    groupRepo *repositories.GroupRepository
    userRepo  *repositories.UserRepository
}

func NewGroupHandler(db *gorm.DB, groupRepo *repositories.GroupRepository, userRepo *repositories.UserRepository) *GroupHandler {
    return &GroupHandler{
        db:        db,
        groupRepo: groupRepo,
        userRepo:  userRepo,
    }
}

// CreateGroup handles creating a new group
func (gh *GroupHandler) CreateGroup(c *gin.Context) {
    var group models.Group
    if err := c.ShouldBindJSON(&group); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
        return
    }

    if err := gh.groupRepo.CreateGroup(&group); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create group"})
        return
    }

    c.JSON(http.StatusCreated, group)
}

// GetGroupByID retrieves a group by its ID
func (gh *GroupHandler) GetGroupByID(c *gin.Context) {
    groupID, err := strconv.ParseUint(c.Param("id"), 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid group ID"})
        return
    }

    group, err := gh.groupRepo.GetGroupByID(uint(groupID))
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Group not found"})
        return
    }

    c.JSON(http.StatusOK, group)
}

// GetAllGroups retrieves all groups
func (gh *GroupHandler) GetAllGroups(c *gin.Context) {
    groups, err := gh.groupRepo.GetAllGroups()
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get groups"})
        return
    }

    c.JSON(http.StatusOK, groups)
}

// UpdateGroup handles updating a group's information
func (gh *GroupHandler) UpdateGroup(c *gin.Context) {
    groupID, err := strconv.ParseUint(c.Param("id"), 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid group ID"})
        return
    }

    var group models.Group
    if err := c.ShouldBindJSON(&group); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
        return
    }

    existingGroup, err := gh.groupRepo.GetGroupByID(uint(groupID))
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Group not found"})
        return
    }

    existingGroup.Name = group.Name
    existingGroup.Description = group.Description
    existingGroup.AdminID = group.AdminID

    if err := gh.groupRepo.UpdateGroup(existingGroup); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update group"})
        return
    }

    c.JSON(http.StatusOK, existingGroup)
}

// DeleteGroup handles deleting a group
func (gh *GroupHandler) DeleteGroup(c *gin.Context) {
    groupID, err := strconv.ParseUint(c.Param("id"), 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid group ID"})
        return
    }

    group, err := gh.groupRepo.GetGroupByID(uint(groupID))
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Group not found"})
        return
    }

    if err := gh.groupRepo.DeleteGroup(group); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete group"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Group deleted"})
}

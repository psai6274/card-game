package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
)

var redisClient *redis.Client

func init() {
	redisClient = redis.NewClient(&redis.Options{
		Addr:     "127.0.0.1:6379", // Change this to your Redis server address
		Password: "",               // No password for local development
		DB:       0,
	})
}

func main() {
	r := gin.Default()

	r.POST("/startGame", startGame)
	r.POST("/drawCard", drawCard)
	r.POST("/defuseBomb", defuseBomb)
	r.GET("/leaderboard", getLeaderboard)
	r.POST("/update-leaderboard/:username", updateLeaderboard)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	err := r.Run(":" + port)
	if err != nil {
		log.Fatal("Failed to start server: ", err)
	}
}

func startGame(c *gin.Context) {
	username := c.Param("username")

	// Initialize game state
	gameState := map[string]interface{}{
		"username":       username,
		"points":         0,
		"deck":           []string{"Cat", "Shuffle", "Bomb", "Defuse"},
		"playerHand":     []string{},
		"bombsDrawn":     0,
		"defuseCards":    0,
		"leaderboardKey": getLeaderboardKey(username),
	}

	// Store the initial game state in Redis
	err := storeGameState(username, gameState)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start the game"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "Game started", "initialState": gameState})
}

func drawCard(c *gin.Context) {
	username := c.Param("username")

	// Retrieve the current game state from Redis
	gameState, err := getGameState(username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve game state"})
		return
	}

	// Implement your card drawing logic here
	// Modify the gameState accordingly

	// Store the updated game state in Redis
	err = storeGameState(username, gameState)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update game state"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "Card drawn", "updatedState": gameState})
}

func storeGameState(username string, gameState map[string]interface{}) error {
	key := getGameStateKey(username)

	// Convert the map to JSON
	data, err := json.Marshal(gameState)
	if err != nil {
		return err
	}

	// Store the JSON data in Redis
	return redisClient.Set(context.Background(), key, data, 0).Err()
}

func getGameState(username string) (map[string]interface{}, error) {
	key := getGameStateKey(username)

	// Retrieve the JSON data from Redis
	data, err := redisClient.Get(context.Background(), key).Result()
	if err != nil {
		return nil, err
	}

	// Convert JSON data to a map
	var gameState map[string]interface{}
	err = json.Unmarshal([]byte(data), &gameState)
	if err != nil {
		return nil, err
	}

	return gameState, nil
}

func defuseBomb(c *gin.Context) {
	username := c.Param("username")

	// Retrieve the current game state from Redis
	gameState, err := getGameState(username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve game state"})
		return
	}

	// Implement your bomb defusing logic here
	// Modify the gameState accordingly

	// Store the updated game state in Redis
	err = storeGameState(username, gameState)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update game state"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "Bomb defused", "updatedState": gameState})
}

func getGameStateKey(username string) string {
	return fmt.Sprintf("user:%s:gameState", username)
}

func getLeaderboardKey(username string) string {
	return fmt.Sprintf("user:%s:leaderboard", username)
}

// ... (other route handler functions)

// ... (other route handler functions)

func updateLeaderboard(c *gin.Context) {
	username := c.Param("username")
	var requestBody map[string]int
	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Assuming you have a saveGameResult function to store the result
	saveGameResult(username, requestBody["points"])

	// Respond with the updated leaderboard
	c.JSON(http.StatusOK, gin.H{"username": username, "points": requestBody["points"]})
}

func getLeaderboard(c *gin.Context) {
	// Implement logic to retrieve leaderboard data from Redis
	// Return the leaderboard data as JSON

	// Example response
	leaderboardData := map[string]interface{}{
		"user1": 10,
		"user2": 8,
		"user3": 15,
		// ... other leaderboard data
	}

	c.JSON(http.StatusOK, gin.H{"leaderboard": leaderboardData})
}

func saveGameResult(username string, points int) {
	// Implement the logic to save the game result in Redis or any other storage mechanism

	// For example, you can store the result in Redis under a key for the user
	key := getLeaderboardKey(username)
	redisClient.ZAdd(context.Background(), key, &redis.Z{
		Score:  float64(points),
		Member: username,
	})
}

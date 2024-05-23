package config

import "fmt"

type AppConfig struct {
    DB   DBConfig
    WS   WSConfig
    JWT  JWTConfig
}

type JWTConfig struct {
    SecretKey string
}

type DBConfig struct {
    Dialect  string
    Host     string
    Port     string
    Username string
    Password string
    Name     string
}

func (dbConfig DBConfig) ConnectionURL() string {
    return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
        dbConfig.Host, dbConfig.Port, dbConfig.Username, dbConfig.Password, dbConfig.Name)
}

type WSConfig struct {
    Port    string
    WsPort  string
}

func LoadConfig() AppConfig {
    // You can load configurations from environment variables, YAML files, or any other source.
    // For simplicity, I'll just hardcode the values here.

    return AppConfig{
        DB: DBConfig{
            Dialect:  "postgres",
            Host:     "localhost",
            Port:     "5432",
            Username: "postgres",
            Password: "postgres",
            Name:     "chatapp",
        },
        WS: WSConfig{
            Port: "8080",
            WsPort: "8000",
        },
        JWT: JWTConfig{
            SecretKey: "Mash", 
        },
    }
}

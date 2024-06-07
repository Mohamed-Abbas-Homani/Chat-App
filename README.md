# Chat-app

Chat-app is a web application designed for seamless and instant communication. This application is built using JavaScript for the front-end and Go for the back-end, providing a real-time chatting experience.

Users can create an account by providing a username, email, and password.Once registered, users can immediately start chatting with others.


![croppy-20240607_200527](https://github.com/husseinhareb/hw-monitor/assets/88323940/67a2d410-7b67-4cd3-aca6-41e6b4a97236)
![croppy-20240607_201236](https://github.com/husseinhareb/hw-monitor/assets/88323940/78319f53-07db-4970-9aba-436f169e384f)


## Features 
Using WebSockets, the following features are seamlessly provided in real time:
- User Authentication
- Real time texts
- Voice messages
- Documents
- Media
- Emojies
- MarkDown as messages
- Profile
- Themes
- Search Messages
## Screenshots
![croppy-20240607_201617](https://github.com/husseinhareb/hw-monitor/assets/88323940/5d6d4ba4-5636-4c3f-a05d-d65f8bff8422)

![croppy-20240607_201338](https://github.com/husseinhareb/hw-monitor/assets/88323940/2883123c-4585-453a-9b99-77a800551fee)




## Tech Stack
### frontend
- [Reactjs](https://react.dev/) library
- [Zustand](https://docs.pmnd.rs/zustand) for managing state
- [styled-components](https://styled-components.com/) for styling

### backend
- [Golang](https://go.dev)
- [Gorm](https://gorm.io) for orm
- [Gin](https://gorm.io) as web framework
- [Gorilla](https://github.com/gorilla/websocket) to handle websockets

### database
- [Postgresql](https://www.postgresql.org/)

## Prerequisites

- Node.js 14.XX or higher
- Go 1.XX or higher
- Make (for building the backend)

## Getting Started
1. **Clone the repository**:

    ```
    git clone https://github.com/Mohamed-Abbas-Homani/Chat-App
    cd Chat-App
    ```
2. **Install Frontend dependencies**:
    ```
    cd frontend
    npm install
    ```
3. **Run the development server for the React frontend**:

    ```
    cd frontend
    npm run dev
    ```
4. **Run the backend server**:
   ```
   cd backend
   make run 
   ```
5. **For building the backend server(optional)**:
   ```
   make build 
   ```

   
## Contributing

Contributions are welcome! If you'd like to contribute:

    Fork the repository.
    Create your branch: git checkout -b feature/YourFeature.
    Commit your changes: git commit -m 'Add some feature'.
    Push to the branch: git push origin feature/YourFeature.
    Submit a pull request.

## Licence

This project is licensed under the [MIT License](https://github.com/Mohamed-Abbas-Homani/Chat-App/blob/main/LICENSE).

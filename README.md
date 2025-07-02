# Todo List CLI Application

A command-line based Todo List application for managing users and their tasks, built using Node.js and Express. This project provides a simple interface to register, login, create, and manage todos via the command line.

## Features

- User registration and authentication (with JWT)
- Secure password handling with bcryptjs
- CRUD operations for Todo tasks
- Rate limiting for security
- MongoDB integration using Mongoose
- CLI interface powered by Commander.js
- Environment variable support with dotenv

## Technologies Used

- JavaScript (Node.js)
- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [Commander](https://www.npmjs.com/package/commander)
- [Axios](https://axios-http.com/)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/imrahul1906/todo_list.git
   cd todo_list
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in the root directory and add your configuration (MongoDB URI, JWT secret, etc).

## Usage

Use the CLI to interact with the Todo List application. Below are the available commands:

- **Register a new user:**
  ```bash
  node cli.js register-user --name <name> --email <email> --pwd <password> --repwd <password>
  ```

- **Login:**
  ```bash
  node cli.js login --email <email> --pwd <password>
  ```

- **Create a todo:**
  ```bash
  node cli.js create-todo --title <title> --des <description>
  ```

- **Delete a todo:**
  ```bash
  node cli.js delete-todo --id <todoId>
  ```

- **Logout:**
  ```bash
  node cli.js logout
  ```

## Project Structure

- `cli.js` — Handles all CLI commands and interactions.
- `AxiosClient.js` — Manages API requests to the server.
- `server/` — Server-side logic and API endpoints.
- `controller/` — Application logic for user and todo management.
- `model/` — Mongoose models for users and todos.
- `middleware/` — Custom Express middleware (authentication, rate limiting, etc).
- `config/` — Configuration files.




https://roadmap.sh/projects/todo-list-api

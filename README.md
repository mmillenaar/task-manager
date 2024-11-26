# Task Manager Application

A full-stack task management application built with React, Node.js, Express, and SQLite.

## Prerequisites

Before running the application, make sure you have the following installed:
- Node.js (v16 or higher)
- npm (Node Package Manager)

## Project Structure

The project consists of two main directories:
- `client/` - React frontend application
- `server/` - Node.js/Express backend application

## Installation

### 1. Backend Setup

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations (if any)
npx prisma migrate dev

# Start the development server
npm run dev
```

The server will start on port 3030 by default.

### 2. Frontend Setup

```bash
# Navigate to the client directory
cd client

# Install dependencies
npm install

# Start the development server
npm start
```

The client application will start on port 3000 and open in your default browser.

## Available Scripts

### Backend (server/)
- `npm run dev` - Start the development server with hot-reload
- `npm run build` - Build the TypeScript project
- `npm start` - Run the production server

### Frontend (client/)
- `npm start` - Start the development server
- `npm run build` - Build the project for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Environment Variables

The server uses the following environment variables (defined in `server/.env`):
- `DATABASE_URL` - SQLite database connection string
- `PORT` - Server port number (default: 3030)

## Technologies Used

### Frontend
- React
- TypeScript
- Material-UI (MUI)
- React Router
- Day.js

### Backend
- Node.js
- Express
- Prisma (ORM)
- SQLite
- JSON Web Token
- bcrypt
- TypeScript

## Development

To work on the project, run both the frontend and backend development servers:

1. Start the backend server first:
```bash
cd server
npm run dev
```

2. In a new terminal, start the frontend development server:
```bash
cd client
npm start
```

## Building for Production

### Backend
```bash
cd server
npm run build
```

### Frontend
```bash
cd client
npm run build
```

## License

ISC
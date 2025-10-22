AI Code Reviewer

An intelligent code reviewer application that leverages the Google Gemini API to analyze code snippets, identify issues, and suggest improvements. Built with React for the frontend and Node.js/Express for the backend.

Features

Code Input: Paste code snippets directly into the application.

Language Selection: Supports multiple programming languages (JavaScript, Python, Java, C++, etc.).

AI-Powered Analysis: Sends code to the Google Gemini API for review via a secure backend.

Issue Reporting: Displays identified issues categorized by severity (Critical, Warning, Suggestion) and type (Bug, Performance, Security, Style).

Detailed Feedback: Provides explanations for each issue (Problem, Why it matters, How to fix).

Code Comparison: Shows a side-by-side view of the original code and the AI-suggested fixed code (only when issues are found).

Copy Functionality: Easily copy the AI-suggested fixed code to the clipboard.

Responsive UI: Built with react-bootstrap for usability across different screen sizes.

Technologies Used

Frontend:

React

React Bootstrap

Bootstrap Icons

JavaScript (ES6+)

Backend:

Node.js

Express.js

Google Gemini API (via node-fetch)

dotenv for environment variables

Deployment (Example):

Render (Manual setup: Backend Web Service + Frontend Static Site)

Vercel (Frontend Static Site + Backend Serverless Functions)

Project Structure

.
├── backend/         # Node.js/Express server
│   ├── node_modules/
│   ├── .env         # Store API keys and config (ignored by Git)
│   ├── .gitignore
│   ├── package.json
│   ├── server.js    # Express application logic
│   └── ...
├── frontend/        # React application
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── App.js   # Main application component
│   │   └── ...
│   ├── .env         # Store backend URL (ignored by Git)
│   ├── .gitignore
│   └── package.json
├── .gitignore       # Root gitignore
└── README.md        # This file



Setup and Installation

Prerequisites:

Node.js (v18 or later recommended)

npm or yarn

Git

A Google Gemini API Key (Get one here)

Steps:

Clone the repository:

git clone (https://github.com/rohanakode/AI-Code-Reviewer.git)

Backend Setup:

cd backend
npm install # or yarn install


Create a .env file in the backend directory and add your Gemini API key:

GEMINI_API_KEY=YOUR_ACTUAL_GEMINI_API_KEY
PORT=3001 # Optional: Default port
NODE_ENV=development # Set to development for local running
FRONTEND_URL=http://localhost:3000 # Your local frontend URL for CORS in dev


Frontend Setup:

cd ../frontend # Go back to root, then into frontend
npm install # or yarn install


Create a .env file in the frontend directory and add the backend URL:

# For Create React App:
REACT_APP_BACKEND_URL=http://localhost:3001

# For Vite (if you used Vite):
# VITE_BACKEND_URL=http://localhost:3001


Running Locally

Start the Backend Server:

cd backend
npm start # Or node server.js


(The server should start on port 3001 by default)

Start the Frontend Development Server:

Open a new terminal window.

cd frontend
npm start # Or yarn start


(The React app should open in your browser, usually at http://localhost:3000)

Environment Variables

The application relies on the following environment variables:

Backend (backend/.env):

GEMINI_API_KEY: Required. Your API key for accessing the Google Gemini API.

PORT: Optional. The port the backend server will run on (defaults to 3001). Render might assign its own port.

NODE_ENV: Set to development locally, production when deployed. Controls CORS and error details.

FRONTEND_URL: Required for Production. The URL of your deployed frontend, used for CORS configuration.

Frontend (frontend/.env):

REACT_APP_BACKEND_URL (for Create React App) or VITE_BACKEND_URL (for Vite): Required. The full URL where the backend API is running (e.g., http://localhost:3001 locally or your deployed backend URL).

Important: Add .env files to your .gitignore to avoid committing sensitive keys.

Deployment

This application can be deployed using various services. See the comments in server.js and App.js regarding NODE_ENV, FRONTEND_URL, and REACT_APP_BACKEND_URL configuration for production.

Render (Manual Setup):

Deploy the backend folder as a Web Service on Render.

Set Root Directory to backend.

Set Build Command to npm install (or yarn install).

Set Start Command to node server.js.

Add Environment Variables: NODE_ENV=production, GEMINI_API_KEY (as a secret value), and FRONTEND_URL (leave blank initially).

Copy the deployed backend URL.

Deploy the frontend folder as a Static Site on Render.

Set Root Directory to frontend.

Set Build Command to npm install && npm run build (or yarn install && yarn build).

Set Publish Directory to build (or dist for Vite).

Add Environment Variable: REACT_APP_BACKEND_URL (or VITE_BACKEND_URL) and set its value to the backend URL you copied.

Copy the deployed frontend URL.

Go back to the backend service's Environment Variables on Render and paste the frontend URL into the FRONTEND_URL variable value. Save changes to trigger a backend redeploy.

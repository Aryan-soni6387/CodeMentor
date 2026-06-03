# 🚀 CodeMentor

An AI-powered DSA Preparation and Interview Practice Platform that helps students track coding progress, analyze performance, receive AI-driven feedback, and prepare for technical interviews.

---

## 📌 Overview

Preparing for coding interviews can be overwhelming. Students often struggle with:

* Tracking solved problems
* Identifying weak topics
* Maintaining consistency
* Getting personalized feedback
* Practicing realistic technical interviews

**CodeMentor** solves these challenges by combining DSA tracking, analytics, AI-powered assistance, and interview preparation into a single platform.

---

## ✨ Features

### 🔐 Authentication

* User Registration
* User Login
* Secure JWT Authentication

### 📊 Dashboard Analytics

* Current Streak & Best Streak
* Total Problems Solved
* Difficulty-wise Analysis
* Topic-wise Analysis
* Strong Topics Detection
* Average Topics Detection
* Weak Topics Detection
* Interview Performance Analytics

### 📚 A2Z DSA Sheet Tracker

* Track DSA Progress
* Mark Problems as Solved
* Topic-wise Completion Tracking
* Progress Percentage Monitoring

### 📝 Notes System

* Add Notes for Individual Problems
* Update Notes Anytime
* Persistent Storage

### 🤖 AI Code Review

* AI-Powered Code Analysis
* Bug Detection
* Time Complexity Analysis
* Space Complexity Analysis
* Optimization Suggestions
* Coding Best Practices Feedback

### 💬 AI Chat Assistant

* DSA Doubt Solving
* Coding Guidance
* Learning Support
* Concept Explanations

### 🎤 AI Interview System

* Topic-Based Interviews
* Difficulty Selection
* Multi-Round Interviews
* AI-Generated Questions
* Real-Time Evaluation
* Detailed Feedback Reports

### 📈 Interview Analytics

* Interview History
* Best Score Tracking
* Average Score Tracking
* Performance Trends

### 🏆 Leaderboard

* Compare Performance with Other Users
* Rank Based on Activity and Progress

### 👤 Profile System

* Streak Tracking
* Badge System
* Activity Calendar
* Monthly Progress Monitoring

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router DOM
* Recharts
* CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### AI Integration

* OpenRouter API
* GPT Models

### Authentication

* JWT (JSON Web Tokens)

---

## 🏗️ System Architecture

```text
User
 │
 ▼
React Frontend
 │
 ▼
Express REST API
 │
 ├── Authentication
 ├── Progress Tracking
 ├── Interview System
 ├── Analytics Engine
 └── AI Services
 │
 ▼
MongoDB Database
```

---

## 🔄 Workflow

1. User logs into the platform.
2. User solves DSA problems and updates progress.
3. Progress data is stored in MongoDB.
4. Dashboard analytics are generated automatically.
5. AI services provide:

   * Code Reviews
   * Interview Questions
   * Feedback Reports
   * Chat Assistance
6. Users analyze strengths and weaknesses through visual dashboards.

---

## 📂 Project Structure

```text
CodeMentor/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── App.css
│   │
│   └── package.json
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## 🗄️ Database Design

### User Collection

Stores:

* User Information
* Authentication Data
* Streak Data
* Progress Data
* Badges
* Goals

### Problem Collection

Stores:

* Solved Problems
* Problem Notes
* Topic Information
* Difficulty Information
* Progress Tracking

### Interview Collection

Stores:

* Interview Reports
* Interview Scores
* Feedback Data
* Performance Analytics

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Aryan-soni6387/CodeMentor.git
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

### Backend Setup

```bash
cd backend
npm install
node server.js
```

---

## 🔑 Environment Variables

Create a `.env` file inside the backend folder:

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openai/gpt-3.5-turbo
```

---

## 📊 Core Modules

### Progress Tracking

* DSA Sheet Tracking
* Topic Completion Analysis
* Difficulty Distribution
* Consistency Monitoring

### Analytics Engine

* Topic Strength Detection
* Weak Area Identification
* Performance Insights
* Interview Analytics

### AI Services

* Code Review
* Chat Assistant
* Interview Generation
* Feedback Evaluation

---

## 🚀 Future Enhancements

* Codeforces Integration
* LeetCode Integration
* Contest Tracker
* Resume Analyzer
* HR Interview Simulator
* Personalized Learning Roadmaps
* Interview Score Trend Visualization
* AI-Based Learning Recommendations
* Company-Wise Question Tracking

---

## 💡 Challenges Faced

* Integrating AI APIs for interview generation and evaluation
* Designing topic-wise and difficulty-wise analytics
* Managing multi-round interview workflows
* Maintaining user progress and streak tracking
* Building responsive dashboards and visualizations
* Optimizing database performance

---

## 📚 Learning Outcomes

Through this project, I gained hands-on experience in:

* Full Stack Web Development
* React.js Development
* Node.js & Express.js
* MongoDB Database Design
* REST API Development
* Authentication & Authorization
* AI API Integration
* Data Visualization
* System Design Fundamentals
* Performance Analytics

---

## 🎯 Project Highlights

✅ Full Stack MERN Application

✅ AI-Powered Code Review

✅ AI Interview Simulation

✅ Real-Time Analytics Dashboard

✅ Progress Tracking System

✅ Performance Monitoring

✅ MongoDB Integration

✅ REST API Architecture

✅ Modern Responsive UI

---

## 👨‍💻 Author

**Aryan Soni**

GitHub: https://github.com/Aryan-soni6387

---

⭐ If you found this project useful, consider giving it a star on GitHub!

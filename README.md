# CodeMentor 🚀

## Project Overview

CodeMentor is an AI-powered DSA preparation and interview practice platform designed to help students improve problem-solving skills, track coding progress, analyze strengths and weaknesses, and prepare for technical interviews.

The platform combines progress tracking, analytics, AI assistance, and interview preparation into a single integrated dashboard.

---

# Problem Statement

Students preparing for coding interviews often struggle to track their progress, identify weak areas, maintain consistency, and receive personalized interview feedback.

CodeMentor addresses these challenges by combining DSA tracking, analytics, AI-powered assistance, and interview preparation into a single platform.

# Objectives

* Help students track DSA progress efficiently.
* Provide AI-powered code reviews and feedback.
* Enable topic-wise and difficulty-wise performance analysis.
* Simulate technical interviews using AI.
* Improve interview readiness through detailed feedback and analytics.
* Maintain coding consistency using streaks and activity tracking.

---

# Key Features

## Authentication

* User Registration
* User Login
* Secure Authentication

## Dashboard Analytics

* Current streak and Best streak
* Total Problems Solved
* Difficulty Analysis
* Topic Analysis
* Strong Topics
* Average Topics
* Weak Topics
* Interview Analytics

## A2Z DSA Sheet Tracker

* Track DSA progress
* Mark problems as solved
* View completion percentage
* Topic-wise progress monitoring

## Notes System

* Add notes for problems
* Update notes anytime
* Store notes permanently

## AI Code Review

* Analyze code using AI
* Detect mistakes
* Time Complexity Analysis
* Space Complexity Analysis
* Optimization Suggestions

## AI Chat Assistant

* DSA doubt solving
* Coding guidance
* Learning support

## AI Interview System

* Topic-based interviews
* Difficulty selection
* Multi-round interviews
* AI-generated questions
* AI evaluation and feedback
* Final interview report

## Interview Analytics

* Interview history
* Best score tracking
* Average score tracking
* Performance monitoring

## Leaderboard

* Compare performance among users
* Ranking based on activity and progress

## Profile System

* Streak Tracking
* Badge System
* Activity Calendar
* Monthly Progress Monitoring

---

# Technology Stack

## Frontend

* React.js
* React Router DOM
* Recharts
* CSS

## Backend

* Node.js
* Express.js

## Database

* MongoDB
* Mongoose

## AI Integration

* OpenRouter API
* GPT Models

---
# System Workflow

1. User logs into the platform.
2. User solves DSA problems and updates progress.
3. Dashboard analytics are updated automatically.
4. AI services provide code reviews, interview questions, and feedback.
5. Progress, notes, and interview reports are stored in MongoDB.
6. Users can analyze strengths and weaknesses through visual analytics.

## Project Structure

```text
CodeMentor/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── App.js
│   │   └── App.css
│
├── backend/
│   ├── models/
│   ├── server.js
│   └── .env.example
│
└── README.md
```

---

# Database Collections

## User

Stores:

* User Information
* Streak Data
* Progress Data
* Badges
* Goals

## Problem

Stores:

* User Problems
* Notes
* Progress Information

## Interview

Stores:

* Interview Reports
* Interview Scores
* Interview Analytics

---

# Installation Guide

## Clone Repository

```bash
git clone <repository-url>
```

## Frontend Setup

```bash
cd frontend
npm install
npm start
```

## Backend Setup

```bash
cd backend
npm install
node server.js
```

## Environment Variables

Create a `.env` file inside the backend folder:

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openai/gpt-3.5-turbo
```

---

# Project Highlights

* Full Stack Web Application
* REST API Architecture
* AI Integration
* Real-Time Analytics
* Technical Interview Simulation
* Performance Tracking Dashboard
* Data Visualization
* MongoDB Integration

---

# Future Scope

* Codeforces Integration
* LeetCode Integration
* Contest Tracker
* Resume Analyzer
* HR Interview Simulator
* Personalized Learning Roadmaps
* Interview Score Trend Analysis
* AI-Based Recommendations

---

# Challenges Faced

- Integrating AI APIs for interview generation and evaluation.
- Managing multi-round interview workflows.
- Designing topic-wise and difficulty-wise analytics.
- Maintaining user progress and streak tracking.
- Building responsive dashboard visualizations.

# Learning Outcomes

This project helped in understanding:

* React Development
* Node.js Backend Development
* MongoDB Database Design
* REST API Development
* Authentication Systems
* AI API Integration
* Data Visualization
* Full Stack Application Development

---

# Author

Aryan Soni 

Github id - Aryan-soni6387



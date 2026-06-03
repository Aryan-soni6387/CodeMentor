const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const Problem = require("./models/Problem");
const User = require("./models/User");
const Chat = require("./models/Chat");
const SheetProblem = require("./models/SheetProblem");
const Interview = require("./models/Interview");

require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log(error);
  });

const app = express();

app.use(cors());
app.use(express.json());

/* Test Route */
app.get("/", (req, res) => {
  res.send("Backend Running");
});

/* AI Review Route */
app.post("/review", async (req, res) => {
  try {
    const { code, language } = req.body;

    const prompt = `
You are a senior software engineer.

Analyze this ${language} code.

Provide:

1. What the code does
2. Time Complexity
3. Space Complexity
4. Bugs or edge cases
5. Optimization suggestions
6. Alternative approach
7. Interview explanation

Code:

${code}
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: process.env.OPENROUTER_MODEL || "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an expert coding interviewer. Analyze code, find bugs, suggest optimizations, and explain time complexity. Be clear and concise.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "CodeMentor",
        },
      }
    );

    const review =
      response.data?.choices?.[0]?.message?.content ||
      "No review generated.";

    res.json({
      review,
    });
  } catch (error) {
    console.log(error.response?.data || error.message || error);
    res.json({
      review: "Error reviewing code",
    });
  }
});

/* Get Chats */
app.get("/chats/:email", async (req, res) => {
  try {
    const chats = await Chat.find({
      userEmail: req.params.email,
    });

    res.json(chats);
  } catch (error) {
    console.log(error);
    res.json([]);
  }
});

/* Get User */
app.get("/user/:email", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.params.email,
    });

    res.json(user);
  } catch (error) {
    console.log(error);
    res.json(null);
  }
});

/* Leaderboard */
app.get("/leaderboard", async (req, res) => {
  try {
    const users = await User.find()
      .sort({ bestStreak: -1 })
      .select("name email bestStreak");

    res.json(users);
  } catch (error) {
    console.log(error);
    res.json([]);
  }
});

/* Activity Calendar */
app.get("/activity/:email", async (req, res) => {
  try {
    const problems = await Problem.find({
      userEmail: req.params.email,
    });

    const activity = {};

    problems.forEach((problem) => {
      if (!problem.createdAt) return;

      const date = new Date(problem.createdAt)
        .toISOString()
        .split("T")[0];

      activity[date] = (activity[date] || 0) + 1;
    });

    res.json(activity);
  } catch (error) {
    console.log(error);
    res.json({});
  }
});

/* DSA Progress (legacy route) */
app.get("/dsa-progress/:email", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.params.email,
    });

    res.json(user?.dsaProgress || {});
  } catch (error) {
    console.log(error);
    res.json({});
  }
});

app.post("/update-dsa-progress", async (req, res) => {
  try {
    await User.findOneAndUpdate(
      {
        email: req.body.email,
      },
      {
        $set: {
          [`dsaProgress.${req.body.topic}`]: req.body.value,
        },
      }
    );

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
    });
  }
});

/* Problem Details */
app.get("/problem/:id", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    res.json(problem);
  } catch (error) {
    console.log(error);
    res.json(null);
  }
});

/* Save Custom Problem */
app.post("/problems", async (req, res) => {
  try {
    const newProblem = new Problem({
      name: req.body.name,
      difficulty: req.body.difficulty,
      topic: req.body.topic,
      statement: req.body.statement,
      link: req.body.link,
      userEmail: req.body.userEmail,
    });

    await newProblem.save();

    const user = await User.findOne({
      email: req.body.userEmail,
    });

    if (user) {
      if (!Array.isArray(user.badges)) {
        user.badges = [];
      }

      const problemCount = await Problem.countDocuments({
        userEmail: req.body.userEmail,
      });

      if (
        problemCount >= 1 &&
        !user.badges.includes("First Problem Solved")
      ) {
        user.badges.push("First Problem Solved");
      }

      await User.findOneAndUpdate(
        {
          email: req.body.userEmail,
        },
        {
          $inc: {
            todaySolved: 1,
          },
        }
      );

      await user.save();
    }

    res.json({
      message: "Problem Saved",
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "Error saving problem",
    });
  }
});

/* Get Custom Problems */
app.get("/problems/:email", async (req, res) => {
  try {
    const problems = await Problem.find({
      userEmail: req.params.email,
    });

    res.json(problems);
  } catch (error) {
    console.log(error);
    res.json([]);
  }
});

/* Delete Custom Problem */
app.delete("/problems/:id", async (req, res) => {
  try {
    await Problem.findByIdAndDelete(req.params.id);

    res.json({
      message: "Problem Deleted",
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "Error deleting problem",
    });
  }
});

/* Signup */
app.post("/signup", async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    await newUser.save();

    res.json({
      message: "User Created",
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "Signup Error",
    });
  }
});

/* Login */
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });

    if (user) {
      const token = jwt.sign(
        {
          email: user.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      res.json({
        success: true,
        message: "Login Successful",
        token: token,
      });
    } else {
      res.json({
        success: false,
        message: "Invalid Credentials",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Login Error",
    });
  }
});

/* AI Chat */
app.post("/ai-chat", async (req, res) => {
  try {
    await Chat.create({
      userEmail: req.body.userEmail,
      sender: "user",
      text: req.body.message,
    });

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an expert coding mentor helping students learn programming.",
          },
          {
            role: "user",
            content: req.body.message,
          },
        ],
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "CodeMentor",
        },
      }
    );

    const reply =
      response.data?.choices?.[0]?.message?.content ||
      "AI Error";

    await Chat.create({
      userEmail: req.body.userEmail,
      sender: "ai",
      text: reply,
    });

    res.json({
      reply,
    });
  } catch (error) {
    console.log(error.response?.data || error.message || error);
    res.json({
      reply: "AI Error",
    });
  }
});

/* A2Z Sheet APIs */
app.post("/add-a2z-problem", async (req, res) => {
  try {
    const problem = new SheetProblem({
      name: req.body.name,
      topic: req.body.topic,
      difficulty: req.body.difficulty,
      link: req.body.link || "",
      notes: req.body.notes || "",
    });

    await problem.save();

    res.json({
      success: true,
      message: "Problem Added",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error adding problem",
    });
  }
});

app.post("/import-a2z", async (req, res) => {
  try {
    await SheetProblem.insertMany(req.body);

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
    });
  }
});

app.get("/a2z-problems", async (req, res) => {
  try {
    const problems = await SheetProblem.find();
    res.json(problems);
  } catch (error) {
    console.log(error);
    res.json([]);
  }
});

app.get("/clear-a2z", async (req, res) => {
  try {
    await SheetProblem.deleteMany({});
    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
    });
  }
});

app.post("/toggle-a2z", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    if (!Array.isArray(user.solvedA2Z)) {
      user.solvedA2Z = [];
    }

    user.currentStreak = Number(user.currentStreak || 0);
    user.bestStreak = Number(user.bestStreak || 0);

    const problemName = String(req.body.problemName || "").trim();

    if (user.solvedA2Z.includes(problemName)) {
      user.solvedA2Z = user.solvedA2Z.filter(
        (problem) => problem !== problemName
      );
    } else {
      user.solvedA2Z.push(problemName);

      const now = new Date();
      const today = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

      const lastDate = user.lastActiveDate
        ? new Date(user.lastActiveDate)
        : null;

      if (!lastDate) {
        user.currentStreak = 1;
      } else {
        const lastDay = new Date(
          lastDate.getFullYear(),
          lastDate.getMonth(),
          lastDate.getDate()
        );

        const diffDays = Math.floor(
          (today.getTime() - lastDay.getTime()) /
            (1000 * 60 * 60 * 24)
        );

        if (diffDays === 0) {
          // already solved today, do nothing
        } else if (diffDays === 1) {
          user.currentStreak += 1;
        } else {
          user.currentStreak = 1;
        }
      }

      user.lastActiveDate = today;

      if (user.currentStreak > user.bestStreak) {
        user.bestStreak = user.currentStreak;
      }
    }

    await user.save();

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
    });
  }
});

app.get("/a2z-progress/:email", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.params.email,
    });

    res.json(user?.solvedA2Z || []);
  } catch (error) {
    console.log(error);
    res.json([]);
  }
});

/* Notes APIs */
app.post("/save-note", async (req, res) => {
  try {
    const { problemId, notes } = req.body;

    if (!problemId) {
      return res.json({
        success: false,
        message: "problemId is required",
      });
    }

    await SheetProblem.findByIdAndUpdate(problemId, {
      notes: notes || "",
    });

    res.json({
      success: true,
      message: "Notes saved successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Failed to save notes",
    });
  }
});

app.get("/note/:problemId", async (req, res) => {
  try {
    const problem = await SheetProblem.findById(req.params.problemId);

    if (!problem) {
      return res.json({
        success: false,
        notes: "",
      });
    }

    res.json({
      success: true,
      notes: problem.notes || "",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      notes: "",
    });
  }
});

/* AI Interview */
app.post("/generate-interview", async (req, res) => {
  try {
    const { topic, difficulty } = req.body;

    const prompt = `
You are a technical interviewer.

Generate ONE DSA interview question.

Topic: ${topic}
Difficulty: ${difficulty}

Rules:
- Return only the question.
- Do not provide hints.
- Do not provide solutions.
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: process.env.OPENROUTER_MODEL || "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an expert DSA interviewer.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "CodeMentor",
        },
      }
    );

    const question =
      response.data?.choices?.[0]?.message?.content ||
      "No question generated.";

    res.json({
      success: true,
      question,
    });
  } catch (error) {
    console.log(
      "Interview Error:",
      error.response?.data || error.message || error
    );

    res.json({
      success: false,
      question: "Failed to generate question",
    });
  }
});

app.post("/evaluate-interview", async (req, res) => {
  try {
    const { question, answer, topic, difficulty } = req.body;

    const prompt = `
You are an expert DSA interviewer.

Interview Question:
${question}

Candidate Answer:
${answer}

Evaluate the answer.

Give:

1. Score out of 10
2. Strengths
3. Weaknesses
4. Improvements
5. Ideal Interview Answer

Be concise but helpful.
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: process.env.OPENROUTER_MODEL || "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a senior technical interviewer.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "CodeMentor",
        },
      }
    );

    const feedback =
      response.data?.choices?.[0]?.message?.content ||
      "Evaluation failed";

    const scoreMatch = feedback.match(/(\d+)\/10/);
    const score = scoreMatch ? Number(scoreMatch[1]) : 0;

    await Interview.create({
      topic,
      difficulty,
      score,
      feedback,
    });

    res.json({
      feedback,
    });
  } catch (error) {
    console.log(error.response?.data || error.message || error);
    res.json({
      feedback: "Evaluation failed",
    });
  }
});

app.get("/interview-history", async (req, res) => {
  try {
    const interviews = await Interview.find().sort({
      createdAt: -1,
    });

    res.json(interviews);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to fetch interview history",
    });
  }
});

app.get("/interview-analytics", async (req, res) => {
  try {
    const interviews = await Interview.find();

    const total = interviews.length;

    const average =
      total === 0
        ? 0
        : (
            interviews.reduce(
              (sum, item) => sum + item.score,
              0
            ) / total
          ).toFixed(1);

    const best =
      total === 0
        ? 0
        : Math.max(...interviews.map((item) => item.score));

    res.json({
      total,
      average,
      best,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to fetch analytics",
    });
  }
});

app.post("/generate-followup", async (req, res) => {
  try {
    const {
      topic,
      difficulty,
      previousQuestion,
      previousAnswer,
    } = req.body;

    const prompt = `
You are conducting a DSA interview.

Topic:
${topic}

Difficulty:
${difficulty}

Previous Question:
${previousQuestion}

Candidate Answer:
${previousAnswer}

Ask the next interview question.

Return ONLY the question.
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: process.env.OPENROUTER_MODEL || "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a senior DSA interviewer.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "CodeMentor",
        },
      }
    );

    res.json({
      question:
        response.data?.choices?.[0]?.message?.content ||
        "Failed to generate question",
    });
  } catch (error) {
    console.log(error);

    res.json({
      question: "Failed to generate question",
    });
  }
});

app.post("/final-interview-evaluation", async (req, res) => {
  try {
    const { topic, difficulty, questions, answers } = req.body;

    const prompt = `
You are an expert DSA interviewer.

Topic:
${topic}

Difficulty:
${difficulty}

Questions:
${questions.join("\n\n")}

Answers:
${answers.join("\n\n")}

Evaluate the complete interview.

Give:

1. Overall Score /10
2. Problem Solving
3. DSA Knowledge
4. Communication
5. Strengths
6. Weaknesses
7. Recommendations
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: process.env.OPENROUTER_MODEL || "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a senior technical interviewer.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "CodeMentor",
        },
      }
    );

    const report =
      response.data?.choices?.[0]?.message?.content ||
      "Evaluation failed";

    const scoreMatch = report.match(/(\d+)\/10/);
    const score = scoreMatch ? Number(scoreMatch[1]) : 0;

    await Interview.create({
      topic,
      difficulty,
      score,
      feedback: report,
    });

    res.json({
      report,
    });
  } catch (error) {
    console.log(error);

    res.json({
      report: "Evaluation failed",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
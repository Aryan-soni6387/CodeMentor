import "../App.css";
import { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Link, useNavigate } from "react-router-dom";
function numberToWords(num) {
  const small = {
    0: "zero",
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
    10: "ten",
    11: "eleven",
    12: "twelve",
    13: "thirteen",
    14: "fourteen",
    15: "fifteen",
    16: "sixteen",
    17: "seventeen",
    18: "eighteen",
    19: "nineteen",
    20: "twenty",
    30: "thirty",
    40: "forty",
    50: "fifty",
    60: "sixty",
    70: "seventy",
    80: "eighty",
    90: "ninety",
  };

  if (small[num] !== undefined) return small[num];

  if (num > 20 && num < 100) {
    const tens = Math.floor(num / 10) * 10;
    const ones = num % 10;
    return small[tens] + (ones ? small[ones] : "");
  }

  return String(num);
}

function normalizeProblemKey(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/\bproblem(s)?\b/g, "")
    .replace(/\b\d+\b/g, (match) => numberToWords(Number(match)))
    .replace(/[^a-z0-9]/g, "");
}

function Dashboard() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [a2zProblems, setA2ZProblems] = useState([]);
  const [a2zProgress, setA2ZProgress] = useState(0);
  const [a2zTotal, setA2ZTotal] = useState(0);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [interviewAnalytics, setInterviewAnalytics] = useState({
    total: 0,
    average: 0,
    best: 0,
  });

  useEffect(() => {
    loadDashboardData();

    const interval = setInterval(() => {
      loadDashboardData();
    }, 5000);

    return () => clearInterval(interval);

    // eslint-disable-next-line
  }, []);

  async function loadDashboardData() {
    await Promise.all([
      fetchUserData(),
      fetchA2ZProblems(),
      fetchA2ZProgress(),
      fetchInterviewAnalytics(),
    ]);
  }

  async function fetchUserData() {
    try {
      const response = await fetch(
        `http://localhost:5000/user/${localStorage.getItem("userEmail")}`
      );
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  }

  async function fetchA2ZProblems() {
    try {
      const response = await fetch("http://localhost:5000/a2z-problems");
      const data = await response.json();

      const safeData = Array.isArray(data) ? data : [];
      setA2ZProblems(safeData);
      setA2ZTotal(safeData.length);
    } catch (error) {
      console.error("Failed to fetch A2Z problems:", error);
      setA2ZProblems([]);
      setA2ZTotal(0);
    }
  }

  async function fetchA2ZProgress() {
    try {
      const response = await fetch(
        `http://localhost:5000/a2z-progress/${localStorage.getItem("userEmail")}`
      );

      const data = await response.json();
      const safeData = Array.isArray(data) ? data : [];

      setSolvedProblems(safeData);
      setA2ZProgress(safeData.length);
    } catch (error) {
      console.error("Failed to fetch A2Z progress:", error);
      setSolvedProblems([]);
      setA2ZProgress(0);
    }
  }

  async function fetchInterviewAnalytics() {
    try {
      const response = await fetch("http://localhost:5000/interview-analytics");
      const data = await response.json();

      setInterviewAnalytics({
        total: data?.total || 0,
        average: data?.average || 0,
        best: data?.best || 0,
      });
    } catch (error) {
      console.log(error);
      setInterviewAnalytics({
        total: 0,
        average: 0,
        best: 0,
      });
    }
  }

  function logoutUser() {
    localStorage.clear();
    navigate("/login");
  }

  

  const solvedSet = useMemo(
    () => new Set(solvedProblems.map((item) => normalizeProblemKey(item))),
    [solvedProblems]
  );

  const isSolved = (problem) =>
    solvedSet.has(normalizeProblemKey(problem._id)) ||
    solvedSet.has(normalizeProblemKey(problem.name));

  const easyCount = a2zProblems.filter((item) => item.difficulty === "Easy").length;
  const mediumCount = a2zProblems.filter((item) => item.difficulty === "Medium").length;
  const hardCount = a2zProblems.filter((item) => item.difficulty === "Hard").length;

  const easySolved = a2zProblems.filter(
    (item) => item.difficulty === "Easy" && isSolved(item)
  ).length;

  const mediumSolved = a2zProblems.filter(
    (item) => item.difficulty === "Medium" && isSolved(item)
  ).length;

  const hardSolved = a2zProblems.filter(
    (item) => item.difficulty === "Hard" && isSolved(item)
  ).length;

  const totalSolved = solvedProblems.length;

  const completionPercentage =
    a2zTotal > 0 ? Math.round((a2zProgress / a2zTotal) * 100) : 0;

  const goalProgress =
    userData?.dailyGoal > 0
      ? Math.min(100, Math.round((totalSolved / Number(userData?.dailyGoal || 0)) * 100))
      : 0;

  const pieData = [
    { name: "Easy", value: easyCount },
    { name: "Medium", value: mediumCount },
    { name: "Hard", value: hardCount },
  ];

  const solvedBarData = [
    { name: "Easy", value: easySolved },
    { name: "Medium", value: mediumSolved },
    { name: "Hard", value: hardSolved },
  ];

  const COLORS = ["#22c55e", "#eab308", "#ef4444"];

  const topicStats = {};
  a2zProblems.forEach((problem) => {
    const topicName = problem.topic || "Uncategorized";

    if (!topicStats[topicName]) {
      topicStats[topicName] = {
        total: 0,
        solved: 0,
      };
    }

    topicStats[topicName].total++;

    if (isSolved(problem)) {
      topicStats[topicName].solved++;
    }
  });

  const topicAnalysis = Object.entries(topicStats).map(([topic, stats]) => ({
    topic,
    total: stats.total,
    solved: stats.solved,
    percentage: stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0,
  }));

  const strongTopics = topicAnalysis.filter((item) => item.percentage >= 70);
  const averageTopics = topicAnalysis.filter(
    (item) => item.percentage >= 30 && item.percentage < 70
  );
  const weakTopics = topicAnalysis.filter((item) => item.percentage < 30);

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>CodeMentor</h2>

        <ul>
          <Link to="/dashboard">
            <li>Dashboard</li>
          </Link>

          <Link to="/profile">
            <li>Profile</li>
          </Link>

          <Link to="/ai-review">
            <li>AI Review</li>
          </Link>

          <Link to="/ai-chat">
            <li>AI Chat</li>
          </Link>

          <Link to="/leaderboard">
            <li>Leaderboard</li>
          </Link>

          <Link to="/a2z-sheet">
            <li>A2Z Sheet</li>
          </Link>

          <Link to="/ai-interview">
            <li>AI Interview</li>
          </Link>

          <Link to="/interview-history">
            <li> Interview History</li>
          </Link>

          <li onClick={logoutUser}>Logout</li>
        </ul>
      </div>

      <div className="main-content">
        <h1>Dashboard</h1>

        <div className="problem-card">
          <h2>📚 A2Z Progress</h2>

          <p>
            Solved: {a2zProgress}/{a2zTotal}
          </p>

          <p>{completionPercentage}% Complete</p>

          <Link to="/a2z-sheet">
            <button>Open A2Z Sheet</button>
          </Link>
        </div>

        <div className="analytics">
          <div className="streak-box">
            <h2>🔥 Current Streak: {userData?.currentStreak || 0}</h2>
            <h2>🏆 Best Streak: {userData?.bestStreak || 0}</h2>
          </div>

          <div className="goal-box">
            <h2>🎯 Daily Goal: {userData?.dailyGoal || 0}</h2>
            <h2>✅ Solved Problems: {totalSolved}</h2>
            <h2>📈 Goal Progress: {goalProgress}%</h2>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${goalProgress}%` }}
              ></div>
            </div>
          </div>

          <div className="analytics-card">
            <h2>{a2zTotal}</h2>
            <p>Total Problems</p>
          </div>

          <div className="analytics-card">
            <h2>{totalSolved}</h2>
            <p>Solved Problems</p>
          </div>

          <div className="analytics-card">
            <h2>{easyCount}</h2>
            <p>Easy</p>
            <p>Solved: {easySolved}</p>
          </div>

          <div className="analytics-card">
            <h2>{mediumCount}</h2>
            <p>Medium</p>
            <p>Solved: {mediumSolved}</p>
          </div>

          <div className="analytics-card">
            <h2>{hardCount}</h2>
            <p>Hard</p>
            <p>Solved: {hardSolved}</p>
          </div>

          <div className="analytics-card">
            <h2>{interviewAnalytics.total}</h2>
            <p>🎤 Total Interviews</p>
          </div>

          <div className="analytics-card">
            <h2>{interviewAnalytics.average}</h2>
            <p>⭐ Average Score</p>
          </div>

          <div className="analytics-card">
            <h2>{interviewAnalytics.best}</h2>
            <p>🏆 Best Score</p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <div className="chart-section">
            <h2>Problem Difficulty Analytics</h2>

            <PieChart width={400} height={300}>
              <Pie
                data={pieData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </div>

          <div className="chart-section">
            <h2>Solved Problems by Difficulty</h2>

            <BarChart width={400} height={300} data={solvedBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </div>
        </div>

        <div className="topic-analysis">
          <div className="analysis-card strong-card">
            <h2>📊 Strong Topics</h2>
            {strongTopics.length > 0 ? (
              strongTopics.map((item) => (
                <div key={item.topic}>
                  <p>
                    {item.topic} ({item.percentage}%)
                  </p>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p>No strong topics yet.</p>
            )}
          </div>

          <div className="analysis-card average-card">
            <h2>📊 Average Topics</h2>
            {averageTopics.length > 0 ? (
              averageTopics.map((item) => (
                <div key={item.topic}>
                  <p>
                    {item.topic} ({item.percentage}%)
                  </p>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p>No average topics.</p>
            )}
          </div>

          <div className="analysis-card weak-card">
            <h2>📊 Weak Topics</h2>
            {weakTopics.length > 0 ? (
              weakTopics.map((item) => (
                <div key={item.topic}>
                  <p>
                    {item.topic} ({item.percentage}%)
                  </p>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p>No weak topics.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
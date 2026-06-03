import AIReview from "./pages/AIReview";
import "./App.css";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import AIChat from "./pages/AIChat";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import ProblemDetails from "./pages/ProblemDetails";
import A2ZSheet from "./pages/A2ZSheet";
import AIInterview from "./pages/AIInterview";
import InterviewHistory from "./pages/InterviewHistory";
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";

function Home() {

  return (

    <div className="app">

      {/* Navbar */}

      <nav className="navbar">

        <h1 className="logo">
          CodeMentor AI
        </h1>

        <Link to="/login">
          <button className="login-btn">
            Login
          </button>
        </Link>

      </nav>

      {/* Hero */}

      <div className="hero">

        <h1>
          Crack Coding Interviews with AI
        </h1>

        <p>
          Practice coding problems and get AI-powered code reviews.
        </p>

        <Link to="/dashboard">

          <button className="start-btn">
            Get Started
          </button>

        </Link>

      </div>

    </div>
  );
}

function App() {

  return (

    <BrowserRouter>

      <Routes>
        <Route
          path="/ai-review"
          element={<AIReview />}
        />
        <Route path="/" element={<Home />} />

        <Route
          path="/dashboard"

          element={
            <ProtectedRoute>

              <Dashboard />

            </ProtectedRoute>
          }
        />

        <Route
          path="/signup"
          element={<Signup />}
        />
        
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/ai-chat"
          element={<AIChat />}
        />
        <Route
          path="/leaderboard"
          element={<Leaderboard />}
        />
        <Route
          path="/profile"
          element={<Profile />}
        />
        <Route
          path="/interview-history"
          element={<InterviewHistory />}
        />
        <Route
          path="/problem/:id"
          element={<ProblemDetails />}
        />
        <Route
          path="/ai-interview"
          element={<AIInterview />}
        />
        <Route
          path="/a2z-sheet"
          element={<A2ZSheet />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
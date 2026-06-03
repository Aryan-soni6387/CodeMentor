import { useState } from "react";
import "../App.css";

function AIInterview() {
  const [topic, setTopic] = useState("Arrays");
  const [difficulty, setDifficulty] = useState("Easy");
  const [totalRounds, setTotalRounds] = useState(3);

  const [currentRound, setCurrentRound] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [finalReport, setFinalReport] = useState("");

  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  async function startInterview() {
    try {
      setLoading(true);
      setEvaluating(false);

      setCurrentRound(0);
      setQuestions([]);
      setAnswers([]);
      setCurrentQuestion("");
      setAnswer("");
      setFeedback("");
      setFinalReport("");

      const response = await fetch(
        "http://localhost:5000/generate-interview",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic,
            difficulty,
          }),
        }
      );

      const data = await response.json();
      const firstQuestion = data.question || "Failed to generate question.";

      setCurrentQuestion(firstQuestion);
      setCurrentRound(1);
    } catch (error) {
      console.log(error);
      setCurrentQuestion("Failed to generate question.");
      setCurrentRound(0);
    } finally {
      setLoading(false);
    }
  }

  async function evaluateAnswer() {
    if (!answer.trim()) {
      setFeedback("Please write an answer first.");
      return;
    }

    if (!currentQuestion.trim()) {
      setFeedback("Please generate a question first.");
      return;
    }

    try {
      setEvaluating(true);
      setFeedback("");

      const updatedQuestions = [...questions, currentQuestion];
      const updatedAnswers = [...answers, answer];

      if (currentRound < totalRounds) {
        const response = await fetch(
          "http://localhost:5000/generate-followup",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              topic,
              difficulty,
              previousQuestion: currentQuestion,
              previousAnswer: answer,
              round: currentRound,
              totalRounds,
            }),
          }
        );

        const data = await response.json();
        const nextQuestion =
          data.question || "Failed to generate follow-up question.";

        setQuestions(updatedQuestions);
        setAnswers(updatedAnswers);
        setCurrentQuestion(nextQuestion);
        setCurrentRound((prev) => prev + 1);
        setAnswer("");
      } else {
        const response = await fetch(
          "http://localhost:5000/final-interview-evaluation",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              topic,
              difficulty,
              questions: updatedQuestions,
              answers: updatedAnswers,
              totalRounds,
            }),
          }
        );

        const data = await response.json();
        const report = data.report || "Evaluation failed.";
        
        setQuestions(updatedQuestions);
        setAnswers(updatedAnswers);
        setFinalReport(report);
        setCurrentQuestion("");
        setAnswer("");
      }
    } catch (error) {
      console.log(error);
      setFeedback("Evaluation failed.");
    } finally {
      setEvaluating(false);
    }
  }

  const nextButtonLabel =
    currentRound < totalRounds
      ? "➡ Next Question"
      : "🏁 Get Final Report";

  return (
    <div className="review-page">
      <h1>🎤 AI Interview</h1>

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        >
          <option value="Arrays">Arrays</option>
          <option value="Linked List">Linked List</option>
          <option value="Stack">Stack</option>
          <option value="Queue">Queue</option>
          <option value="Trees">Trees</option>
          <option value="BST">BST</option>
          <option value="Graphs">Graphs</option>
          <option value="Heap">Heap</option>
          <option value="Greedy">Greedy</option>
          <option value="DP">DP</option>
        </select>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select
          value={totalRounds}
          onChange={(e) => setTotalRounds(Number(e.target.value))}
        >
          <option value={1}>1 Question</option>
          <option value={3}>3 Questions</option>
          <option value={5}>5 Questions</option>
          <option value={10}>10 Questions</option>
        </select>

        <button onClick={startInterview} disabled={loading}>
          {loading ? "Generating..." : "🚀 Start Interview"}
        </button>
      </div>

      <div className="review-box">
        <h2>Interview Question</h2>

        {currentQuestion ? (
          <>
            <p style={{ marginBottom: "10px" }}>
              Round {currentRound} of {totalRounds}
            </p>

            <pre style={{ whiteSpace: "pre-wrap" }}>
              {currentQuestion}
            </pre>
          </>
        ) : (
          <p>
            Select a topic, difficulty, and number of questions, then click
            Start Interview.
          </p>
        )}
      </div>

      {currentQuestion && !finalReport && (
        <>
          <div className="review-box">
            <h2>Your Answer</h2>

            <textarea
              rows="10"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Write your answer here..."
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "10px",
                background: "#111",
                color: "white",
                border: "1px solid #333",
                borderRadius: "8px",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "15px",
            }}
          >
            <button onClick={evaluateAnswer} disabled={evaluating}>
              {evaluating ? "Evaluating..." : nextButtonLabel}
            </button>

            <button onClick={startInterview} disabled={loading}>
              🔄 New Interview
            </button>
          </div>

          {feedback && (
            <p style={{ marginTop: "12px" }}>{feedback}</p>
          )}
        </>
      )}

      {questions.length > 0 && (
        <div className="review-box">
          <h2>Interview Progress</h2>

          {questions.map((q, index) => (
            <div key={index} style={{ marginBottom: "18px" }}>
              <p>
                <strong>Question {index + 1}:</strong>
              </p>
              <pre style={{ whiteSpace: "pre-wrap" }}>{q}</pre>

              <p style={{ marginTop: "10px" }}>
                <strong>Answer {index + 1}:</strong>
              </p>
              <pre style={{ whiteSpace: "pre-wrap" }}>
                {answers[index] || "Pending"}
              </pre>
            </div>
          ))}
        </div>
      )}

      {finalReport && (
        <div className="review-box">
          <h2>Final Interview Report</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{finalReport}</pre>
        </div>
      )}
    </div>
  );
}

export default AIInterview;
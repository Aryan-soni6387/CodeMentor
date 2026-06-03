import { useEffect, useState } from "react";

function InterviewHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const response = await fetch(
        "http://localhost:5000/interview-history"
      );

      const data = await response.json();

      setHistory(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="profile-page">
      <h1>🎤 Interview History</h1>

      {history.length === 0 ? (
        <p>No interviews found.</p>
      ) : (
        history.map((item) => (
          <div
            key={item._id}
            className="problem-card"
          >
            <h3>
              {item.topic}
            </h3>

            <p>
              Difficulty:{" "}
              {item.difficulty}
            </p>

            <p>
              Score: {item.score}/10
            </p>

            <p>
              Date:{" "}
              {new Date(
                item.createdAt
              ).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default InterviewHistory;
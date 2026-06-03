import { useEffect, useMemo, useState } from "react";

function normalizeKey(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");
}

function A2ZSheet() {
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [topicFilter, setTopicFilter] = useState("All");
  const [showSolvedOnly, setShowSolvedOnly] = useState(false);
  const [showUnsolvedOnly, setShowUnsolvedOnly] = useState(false);

  const [selectedProblem, setSelectedProblem] = useState(null);
  const [noteText, setNoteText] = useState("");

  const [newName, setNewName] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [newDifficulty, setNewDifficulty] = useState("Easy");
  const [newLink, setNewLink] = useState("");

  useEffect(() => {
    fetchProblems();
    fetchProgress();
  }, []);

  

  async function fetchProblems() {
    try {
      const response = await fetch("http://localhost:5000/a2z-problems");
      const data = await response.json();
      setProblems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch A2Z problems:", error);
      setProblems([]);
    }
  }

  async function fetchProgress() {
    try {
      const response = await fetch(
        `http://localhost:5000/a2z-progress/${localStorage.getItem("userEmail")}`
      );
      const data = await response.json();
      setSolvedProblems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch A2Z progress:", error);
      setSolvedProblems([]);
    }
  }

  const solvedSet = useMemo(
    () => new Set(solvedProblems.map((item) => normalizeKey(item))),
    [solvedProblems]
  );

  const isSolved = (problem) =>
    solvedSet.has(normalizeKey(problem.name || ""));

  async function toggleSolved(problemName) {
    try {
      const response = await fetch("http://localhost:5000/toggle-a2z", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: localStorage.getItem("userEmail"),
          problemName: String(problemName || "").trim(),
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to update solve status");
      }

      await fetchProgress();
    } catch (error) {
      console.error("Failed to toggle solved state:", error);
    }
  }

  async function addProblem() {
    if (!newName.trim() || !newTopic.trim()) return;

    try {
      const response = await fetch("http://localhost:5000/add-a2z-problem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName.trim(),
          topic: newTopic.trim(),
          difficulty: newDifficulty,
          link: newLink.trim(),
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to add problem");
      }

      setNewName("");
      setNewTopic("");
      setNewDifficulty("Easy");
      setNewLink("");
      await fetchProblems();
    } catch (error) {
      console.error("Failed to add problem:", error);
    }
  }

  async function openNotes(problem) {
    try {
      setSelectedProblem(problem);
      setNoteText("");

      const response = await fetch(
        `http://localhost:5000/note/${problem._id}`
      );
      const data = await response.json();

      if (data.success) {
        setNoteText(data.notes || "");
      }
    } catch (error) {
      console.error("Failed to load notes:", error);
      setNoteText("");
    }
  }

  async function saveNote() {
    if (!selectedProblem) return;

    try {
      const response = await fetch("http://localhost:5000/save-note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problemId: selectedProblem._id,
          notes: noteText,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to save notes");
      }

      setSelectedProblem(null);
      setNoteText("");
      await fetchProblems();
    } catch (error) {
      console.error("Failed to save notes:", error);
    }
  }

  const topicStats = {};
  problems.forEach((problem) => {
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

  const filteredProblems = problems.filter((problem) => {
    const problemName = (problem.name || "").toLowerCase();
    const problemDifficulty = problem.difficulty || "";
    const problemTopic = problem.topic || "Uncategorized";
    const solved = isSolved(problem);

    const searchMatch = problemName.includes(search.toLowerCase());
    const difficultyMatch =
      difficultyFilter === "All" || problemDifficulty === difficultyFilter;
    const topicMatch = topicFilter === "All" || problemTopic === topicFilter;

    if (showSolvedOnly && !solved) return false;
    if (showUnsolvedOnly && solved) return false;

    return searchMatch && difficultyMatch && topicMatch;
  });

  const totalSolved = solvedProblems.length;
  const totalProblems = problems.length;
  const completionPercentage =
    totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;

  function handleSolvedOnlyClick() {
    if (showSolvedOnly) {
      setShowSolvedOnly(false);
    } else {
      setShowSolvedOnly(true);
      setShowUnsolvedOnly(false);
    }
  }

  function handleUnsolvedOnlyClick() {
    if (showUnsolvedOnly) {
      setShowUnsolvedOnly(false);
    } else {
      setShowUnsolvedOnly(true);
      setShowSolvedOnly(false);
    }
  }

  return (
    <div className="profile-page">
      <h1>📚 Striver A2Z Sheet</h1>

      <details>
        <summary>➕ Add Custom Problem</summary>

        <div className="add-problem-box">
          <h2>Add Problem</h2>

          <input
            placeholder="Problem Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

          <input
            placeholder="Topic"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
          />

          <select
            value={newDifficulty}
            onChange={(e) => setNewDifficulty(e.target.value)}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <input
            placeholder="Problem Link"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
          />

          <button onClick={addProblem}>Add Problem</button>
        </div>
      </details>

      <div className="stats-row">
        <div className="stat-card">
          <h2>{completionPercentage}%</h2>
          <p>Complete</p>
        </div>

        <div className="stat-card">
          <h2>{totalSolved}</h2>
          <p>Solved</p>
        </div>

        <div className="stat-card">
          <h2>{totalProblems}</h2>
          <p>Total Problems</p>
        </div>

        <div className="stat-card">
          <h2>{totalProblems - totalSolved}</h2>
          <p>Remaining</p>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search Problem"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="filter-buttons">
        <button onClick={handleSolvedOnlyClick}>
          {showSolvedOnly ? "Show All" : "Show Solved Only"}
        </button>

        <button onClick={handleUnsolvedOnlyClick}>
          {showUnsolvedOnly ? "Show All" : "Show Unsolved Only"}
        </button>
      </div>

      <select
        value={difficultyFilter}
        onChange={(e) => setDifficultyFilter(e.target.value)}
      >
        <option value="All">All Difficulties</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      <select
        value={topicFilter}
        onChange={(e) => setTopicFilter(e.target.value)}
      >
        <option value="All">All Topics</option>
        {[...new Set(problems.map((problem) => problem.topic || "Uncategorized"))].map(
          (topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          )
        )}
      </select>

      <details>
        <summary>📊 Topic Progress</summary>

        {Object.entries(topicStats).map(([topic, stats]) => {
          const topicPercentage =
            stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0;

          return (
            <div key={topic} className="topic-card">
              <h3>
                {topic} {stats.solved}/{stats.total} ({topicPercentage}%)
                {stats.solved === stats.total && stats.total > 0 && (
                  <span> ✅ Completed</span>
                )}
              </h3>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${topicPercentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </details>

      <div className="problem-list">
        {filteredProblems.length === 0 ? (
          <p>No problems found.</p>
        ) : (
          filteredProblems.map((problem) => {
            const solved = isSolved(problem);

            return (
              <div
                key={problem._id}
                className={solved ? "problem-card solved-card" : "problem-card"}
              >
                <h3>{problem.name}</h3>
                <p>{problem.topic || "Uncategorized"}</p>
                <p>{problem.difficulty}</p>

                <button
                  onClick={() =>
                    window.open(
                      `https://www.google.com/search?q=${encodeURIComponent(
                        `${problem.name} leetcode`
                      )}`,
                      "_blank"
                    )
                  }
                >
                  🔍 Search Problem
                </button>

                <button onClick={() => openNotes(problem)}>
                  📝 Notes
                </button>

                <button onClick={() => toggleSolved(problem.name)}>
                  {solved ? "✅ Solved" : "⬜ Mark Solved"}
                </button>
              </div>
            );
          })
        )}
      </div>

      {selectedProblem && (
        <div className="notes-modal">
          <div className="notes-content">
            <h2>{selectedProblem.name}</h2>

            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write your notes here..."
            />

            <div className="filter-buttons">
              <button onClick={saveNote}>Save Notes</button>
              <button onClick={() => setSelectedProblem(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default A2ZSheet;
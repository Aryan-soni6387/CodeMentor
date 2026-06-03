import { useEffect, useState } from "react";

function Leaderboard() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  async function fetchLeaderboard() {

    const response = await fetch(
      "http://localhost:5000/leaderboard"
    );

    const data = await response.json();

    setUsers(data);
  }

  return (

    <div className="profile-page">

      <h1>🏆 Leaderboard</h1>

      {users.map((user, index) => (

        <div
          key={user._id}
          className="leaderboard-card"
        >

          <h2>
            #{index + 1}
          </h2>

          <p>
            {user.name}
          </p>

          <p>
            🔥 {user.bestStreak}
          </p>

        </div>

      ))}

    </div>
  );
}

export default Leaderboard;
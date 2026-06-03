import { useEffect, useState } from "react";

function Profile() {

const [userData, setUserData] = useState(null);
const [activity, setActivity] = useState({});
useEffect(() => {
fetchUserData();
fetchActivity();
}, []);

const [selectedMonth, setSelectedMonth] = useState(
  new Date().getMonth()
);

const [selectedYear, setSelectedYear] = useState(
  new Date().getFullYear()
);

async function fetchActivity() {

const response = await fetch(
    `http://localhost:5000/activity/${
    localStorage.getItem("userEmail")
    }`
);

const data = await response.json();

setActivity(data);
}
async function fetchUserData() {

const response = await fetch(
    `http://localhost:5000/user/${
    localStorage.getItem("userEmail")
    }`
);

const data = await response.json();

setUserData(data);
}

const days = [];

const currentYear = selectedYear;
const currentMonth = selectedMonth;

const daysInMonth = new Date(
  currentYear,
  currentMonth + 1,
  0
).getDate();

for (let day = 1; day <= daysInMonth; day++) {
  const date = new Date(
    currentYear,
    currentMonth,
    day
  );

  days.push(
    date.toISOString().split("T")[0]
  );
}
const monthDays = days;

const solvedThisMonth = monthDays.reduce(
  (sum, day) => sum + (activity[day] || 0),
  0
);

const activeDays = monthDays.filter(
  (day) => (activity[day] || 0) > 0
).length;

const bestDay = Math.max(
  ...monthDays.map(
    (day) => activity[day] || 0
  ),
  0
);
return (

<div className="profile-page">

    <h1>Profile</h1>

    <h2>Name: {userData?.name}</h2>

    <h2>Email: {userData?.email}</h2>

    <h2>
    🔥 Current Streak:
    {userData?.currentStreak || 0}
    </h2>

    <h2>
    🏆 Best Streak:
    {userData?.bestStreak || 0}
    </h2>

    <h2>🏅 Badges</h2>

    <div className="badges-container">

        {userData?.badges?.map((badge, index) => (

            <div
            key={index}
            className="badge-card"
            >

            🏅 {badge}

            </div>

        ))}

    </div>
    

    <h2>📅 Activity Calendar</h2>
    <div
        style={{
            display: "flex",
            gap: "10px",
            marginBottom: "15px",
        }}
        >
        <select
            value={selectedMonth}
            onChange={(e) =>
            setSelectedMonth(
                Number(e.target.value)
            )
            }
        >
            <option value={0}>January</option>
            <option value={1}>February</option>
            <option value={2}>March</option>
            <option value={3}>April</option>
            <option value={4}>May</option>
            <option value={5}>June</option>
            <option value={6}>July</option>
            <option value={7}>August</option>
            <option value={8}>September</option>
            <option value={9}>October</option>
            <option value={10}>November</option>
            <option value={11}>December</option>
        </select>

        <select
            value={selectedYear}
            onChange={(e) =>
            setSelectedYear(
                Number(e.target.value)
            )
            }
        >
            {[2024, 2025, 2026, 2027, 2028].map(
            (year) => (
                <option
                key={year}
                value={year}
                >
                {year}
                </option>
            )
            )}
        </select>
    </div>
    <h3
        style={{
            textAlign: "left",
            marginBottom: "15px",
        }}
        >
        {new Date(
            selectedYear,
            selectedMonth
        ).toLocaleString("default", {
            month: "long",
            year: "numeric",
        })}
    </h3>

    <div className="calendar-grid">

    {days.map((day) => {
        const count =
            activity[day] || 0;

        let bgColor = "#222";

        if (count >= 1)
            bgColor = "#39d353";

        if (count >= 3)
            bgColor = "#26a641";

        if (count >= 5)
            bgColor = "#006d32";

        return (
            <div
            key={day}
            className="calendar-day"
            style={{
                backgroundColor:
                bgColor,
            }}
            title={`${day}
        ${count} problem${
                count !== 1
                ? "s"
                : ""
            } solved`}
            ></div>
        );
    })}
    </div>
    <div
        style={{
            display: "flex",
            gap: "20px",
            marginBottom: "15px",
            flexWrap: "wrap",
        }}
        >
        <div>
            📚 Problems Solved: {solvedThisMonth}
        </div>

        <div>
            🔥 Active Days: {activeDays}
        </div>

        <div>
            🏆 Best Day: {bestDay}
        </div>
    </div>

</div>
);
}

export default Profile;
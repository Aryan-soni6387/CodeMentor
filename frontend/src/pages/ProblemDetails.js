import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProblemDetails() {

  const { id } = useParams();

  const [problem, setProblem] =
    useState(null);
    useEffect(() => {
    async function fetchProblem() {

      const response = await fetch(
        `http://localhost:5000/problem/${id}`
      );

      const data = await response.json();

      setProblem(data);
    }

    fetchProblem();

  }, [id]);

  

  if (!problem)
    return <h1>Loading...</h1>;

  return (

    <div className="profile-page">

      <h1>{problem.name}</h1>

      <h2>
        Difficulty:
        {problem.difficulty}
      </h2>

      <h2>
        Topic:
        {problem.topic}
      </h2>

      <p>
        {problem.statement}
      </p>

      <a

        href={problem.link}

        target="_blank"

        rel="noreferrer"

      >
        Open Problem
      </a>

    </div>
  );
}

export default ProblemDetails;
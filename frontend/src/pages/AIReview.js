import "../App.css";
import { useState } from "react";
import Editor from "@monaco-editor/react";

function AIReview() {
  const [code, setCode] = useState(`#include <iostream>
using namespace std;

int main() {
    cout << "Hello World";
    return 0;
}`);

  const [language, setLanguage] = useState("cpp");
  const [review, setReview] = useState("");

  const [reviewing, setReviewing] = useState(false);

  

  async function reviewCode() {
    if (!code.trim()) {
      setReview(
        "Please enter some code."
      );
      return;
    }

    try {
      setReviewing(true);
      setReview(
        "Generating review..."
      );

      const response = await fetch(
        "http://localhost:5000/review",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            code,
            language,
          }),
        }
      );

      const data =
        await response.json();

      setReview(
        data.review ||
        "No review generated."
      );
    } catch (error) {
      console.log(error);

      setReview(
        "Review Error"
      );
    } finally {
      setReviewing(false);
    }
  }

  return (
    <div className="review-page">
      <h1>🤖 AI Code Review</h1>

      <select
        value={language}
        onChange={(e) =>
          setLanguage(e.target.value)
        }
      >
        <option value="cpp">
          C++
        </option>

        <option value="python">
          Python
        </option>

        <option value="java">
          Java
        </option>

        <option value="javascript">
          JavaScript
        </option>
      </select>

      <Editor
        height="500px"
        theme="vs-dark"
        language={
          language === "cpp"
            ? "cpp"
            : language
        }
        value={code}
        onChange={(value) =>
          setCode(value || "")
        }
        options={{
          fontSize: 16,
          minimap: {
            enabled: false,
          },
          automaticLayout: true,
          scrollBeyondLastLine: false,
        }}
      />

      
      <div className="action-buttons">
      <button
        onClick={reviewCode}
        disabled={reviewing}
      >
        {reviewing
          ? "Reviewing..."
          : "🔍 Review Code"}
      </button>
    </div>

      <div className="review-box">
        <h2>
          AI Feedback
        </h2>

        <pre>{review}</pre>
      </div>
    </div>
  );
}

export default AIReview;
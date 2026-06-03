import "../App.css";
import { useEffect, useState } from "react";

function AIChat() {

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);
  useEffect(() => {

    fetchChats();

  }, []);

  async function fetchChats() {

    const response = await fetch(

        `http://localhost:5000/chats/${
        localStorage.getItem("userEmail")
        }`
    );

    const data = await response.json();

    setMessages([...data]);
}

  async function askAI() {

        if (!message) return;

        try {

            const response = await fetch(

            "http://localhost:5000/ai-chat",

            {
                method: "POST",

                headers: {
                "Content-Type": "application/json",
                },

                body: JSON.stringify({

                message: message,

                userEmail:
                    localStorage.getItem("userEmail"),
                }),
            }
            );

            await response.json();

            await fetchChats();

            setMessage("");

        } catch (error) {

            console.log(error);
        }
    }
  return (

    <div className="chat-page">

      <h1>AI Coding Assistant</h1>

      {/* Chat Messages */}

      <div className="messages-container">

        {messages.map((msg, index) => (

          <div

            key={index}

            className={
              msg.sender === "user"
              ? "user-message"
              : "ai-message"
            }
          >

            {msg.text}

          </div>

        ))}

      </div>

      {/* Input */}

      <div className="chat-input">

        <input

          type="text"

          placeholder="Ask coding question..."

          value={message}

          onChange={(e) => setMessage(e.target.value)}
        />

        <button onClick={askAI}>
          Send
        </button>

      </div>

    </div>
  );
}

export default AIChat;
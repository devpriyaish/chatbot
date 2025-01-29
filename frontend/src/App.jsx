import React, { useState } from "react";
import axios from "axios";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      // Send user input to the backend
      const response = await axios.post("http://127.0.0.1:8000/chat", {
        prompt: input,
      });

      // Update messages with user input and chatbot response
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: input },
        { sender: "bot", text: response.data.response },
      ]);

      // Clear input field
      setInput("");
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Chatbot</h1>
      <div style={styles.chatWindow}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={msg.sender === "user" ? styles.userMessage : styles.botMessage}
          >
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Send
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  chatWindow: {
    border: "1px solid #ccc",
    borderRadius: "5px",
    height: "400px",
    overflowY: "scroll",
    padding: "10px",
    marginBottom: "10px",
  },
  userMessage: {
    textAlign: "right",
    color: "blue",
    marginBottom: "10px",
  },
  botMessage: {
    textAlign: "left",
    color: "green",
    marginBottom: "10px",
  },
  form: {
    display: "flex",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    marginLeft: "10px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
  },
};

export default App;
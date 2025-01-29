import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css"; // Import a CSS file for styling

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isBotTyping, setIsBotTyping] = useState(false); // Track typing state
  const chatWindowRef = useRef(null);

  // Automatically scroll to the bottom of the chat window
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  // Simulate typing effect
  const simulateTyping = async (responseText) => {
    setIsBotTyping(true); // Start typing
    let displayedText = "";
    for (let i = 0; i < responseText.length; i++) {
      displayedText += responseText[i];
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1), // Keep all messages except the last one
        { sender: "bot", text: displayedText }, // Update the last message
      ]);
      await new Promise((resolve) => setTimeout(resolve, 30)); // Typing speed
    }
    setIsBotTyping(false); // Stop typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      // Add the user's message to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: input },
      ]);

      // Clear input field
      setInput("");

      // Send user input to the backend
      const response = await axios.post("http://127.0.0.1:8000/chat", {
        prompt: input,
      });

      // Add a placeholder for the bot's response
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "" }, // Empty message to be filled by typing effect
      ]);

      // Simulate typing effect for the bot's response
      await simulateTyping(response.data.response);
    } catch (error) {
      console.error("Error fetching response:", error);
      // Add an error message to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Sorry, something went wrong. Please try again." },
      ]);
    }
  };

  return (
    <div className="chatbot-container">
      <h1 className="chatbot-title">Hydra Chatbot</h1>
      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
          >
            <div className="message-content">
              {/* Display message text */}
              {msg.text}
              {/* Show typing indicator if the bot is typing */}
              {isBotTyping && index === messages.length - 1 && (
                <span className="typing-indicator">...</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button
          type="submit"
          className="send-button"
          disabled={!input.trim() || isBotTyping} // Disable button if input is empty or bot is typing
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default App; 
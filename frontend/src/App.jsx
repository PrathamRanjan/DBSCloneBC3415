import React, { useState } from "react";
import "./index.css";
import dbsLogo from "./assets/logowhite.png";
import { FaUser, FaSearch, FaEnvelope, FaSitemap, FaSignOutAlt, FaCommentDots, FaTimes, FaPaperPlane } from "react-icons/fa";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  @import url('https://db.onlinewebfonts.com/c/19b16f62a14ab3851710cff5d5b156b6?family=Sirichana+W31+Bold');

  * {
    font-family: "Sirichana W31 Bold", sans-serif !important;
  }
`;
function App() {
  const [activeTab, setActiveTab] = useState("My Accounts");
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "👋 Hi! How can I assist you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return; // Prevent empty messages

    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);

    try {
      // Call Flask API (port 5009)
      const response = await fetch("http://127.0.0.1:5009/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });

      const data = await response.json();
      const botMessage = { text: data.response, sender: "bot" };

      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([...messages, userMessage, { text: "❌ Error connecting to chatbot.", sender: "bot" }]);
    }

    setInput(""); // Clear input field
  };

  return (
    <div className="min-h-screen font-[Sirichana W31 Bold] bg-gray-200 flex flex-col items-center">
      
      {/* Fixed Header - Centered at 70% Width */}
      <div className="w-[70%] fixed top-0 bg-white shadow-md z-50">
        
        {/* Top Black Section (Icons + Logout Button) */}
        <div className="flex">
          {/* Left Black Section */}
          <div className="w-[88%] bg-black text-white flex justify-between items-center p-4">
            <img src={dbsLogo} alt="DBS Logo" className="h-10" />
            <div className="flex space-x-6">
              <FaSitemap size={20} />
              <FaUser size={20} />
              <FaEnvelope size={20} />
              <FaSearch size={20} />
            </div>
          </div>

          {/* Right Logout Button */}
          <button className="w-[12%] bg-[#7f0000] text-white flex items-center justify-center px-4 hover:bg-[#600000]">
            <span className="mr-2">Proceed to Logout</span>
            <FaSignOutAlt />
          </button>
        </div>

        {/* Bottom Navigation Bar */}
        <nav className="grid grid-cols-8 text-center border-b border-gray-300">
          {[
            { name: "My Accounts", sub: "Summary" },
            { name: "Transfer", sub: "Local or Overseas" },
            { name: "Pay", sub: "Bills and Cards" },
            { name: "Cards", sub: "Activate and Manage" },
            { name: "Plan", sub: "Your Finances" },
            { name: "Invest", sub: "Manage your Wealth" },
            { name: "Apply", sub: "New Products" },
            { name: "Request", sub: "Statements or Services" },
          ].map((tab) => (
            <div
              key={tab.name}
              className={`relative cursor-pointer py-2 transition-all ${
                activeTab === tab.name ? "text-[#cc0100]" : "text-black"
              }`}
              onClick={() => setActiveTab(tab.name)}
            >
              {/* Tab Name */}
              <a href="#" className="block text-lg font-bold">{tab.name}</a>

              {/* Subheader */}
              <span className="block text-gray-500 text-sm">{tab.sub}</span>

              {/* 🔴 Red Line (Spanning Full Tab Width) */}
              {activeTab === tab.name && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#cc0100]"></div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Centered Text Box (Smaller than Header) */}
      <div className="mt-40 w-[69%] bg-white p-6 shadow-lg rounded-md border border-gray-300 text-center">
        <h2 className="text-2xl font-bold text-[#7f0000] mb-2">Welcome Back</h2>
        <p className="text-gray-700 mb-4">
          Your last login was <strong>04:30 PM on Tuesday 4th March 2025</strong> (Singapore)
        </p>
        <p className="text-gray-500">
          Would you like to personalize your name? <span className="text-red-500">Yes</span> or <span className="text-red-500">No</span>
        </p>
      </div>

      {/* 🔹 DigiBot Chatbot Button (Bottom Right) */}
      <button
        className="fixed bottom-6 right-6 bg-[#cc0100] text-white p-4 rounded-full shadow-lg hover:bg-[#7f0000] transition-all flex items-center"
        onClick={() => setChatOpen(true)}
      >
        <FaCommentDots size={20} className="mr-2" />
        Chat
      </button>

      {/* 🔹 DigiBot Chat Window */}
      {chatOpen && (
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-white shadow-lg border border-gray-300 rounded-lg flex flex-col">
          {/* Chatbot Header */}
          <div className="bg-[#cc0100] text-white flex justify-between items-center p-3 rounded-t-lg">
            <span className="text-lg font-bold">DigiBot</span>
            <FaTimes className="cursor-pointer" onClick={() => setChatOpen(false)} />
          </div>

          {/* Chatbot Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <p key={index} className={`mb-2 p-2 rounded ${msg.sender === "bot" ? "bg-gray-200 text-black" : "bg-[#cc0100] text-white self-end"}`}>
                {msg.text}
              </p>
            ))}
          </div>

          {/* Chatbot Input */}
          <div className="p-3 border-t border-gray-300 flex">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full p-2 border border-gray-300 rounded-l focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={sendMessage} className="bg-[#cc0100] text-white px-4 py-2 rounded-r hover:bg-[#7f0000]">
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;

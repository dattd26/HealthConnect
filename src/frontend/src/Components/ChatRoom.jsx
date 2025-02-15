import React, { useState, useEffect } from "react";
import axios from "axios";

const ChatRoom = ({ senderUsername, receiverUsername }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const token = localStorage.getItem("token");
  useEffect(() => {
    // Lấy tin nhắn từ API
    axios
      .get(`http://localhost:8080/api/chat/all?user1=${senderUsername}&user2=${receiverUsername}`, {
        headers: { 'Authorization': 'Bearer ' + token}
      })
      .then((response) => setMessages(response.data))
      .catch((error) => console.error(error));
    
      
  }, [senderUsername, receiverUsername]);
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const messageData = {
        senderUsername: senderUsername ,
        receiverUsername: receiverUsername,
        message: newMessage,
    };

    axios
      .post("http://localhost:8080/api/chat", messageData, {
        headers: { 'Authorization': 'Bearer ' + token}
      })
      .then((response) => {
        setMessages((prev) => [...prev, response.data]);
        setNewMessage("");
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="chatroom border border-gray-300 rounded-lg p-4 max-w-md mx-auto mt-5">
    <h2 className="text-lg font-bold mb-3">Đoạn chat với chủ xe {receiverUsername}</h2>
    <div className="messages h-72 overflow-y-scroll mb-3 space-y-2">
        {messages.map((msg) => (
            <div
            key={msg.id}
            className={`message p-2 rounded-md ${
                msg.senderUsername === senderUsername
                ? "bg-green-100 text-right"
                : "bg-gray-100 text-left"
            }`}
            >
            <p className="break-words">{msg.message}</p>
            </div>
    ))}
    </div>

    <div className="input-area flex">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message"
        className="flex-1 p-2 rounded-l-md border border-gray-300"
      />
      <button
        onClick={handleSendMessage}
        className="p-2 px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition"
      >
        Send
      </button>
    </div>
  </div>
  
  );
};

export default ChatRoom;

import React, { useState, useEffect, useRef } from "react";
import IntroductionPage from "./IntroductionPage";
import Profilepage from "./ProfilePage";
import { BsChatDotsFill, BsPeopleFill, BsGearFill, BsArchiveFill, BsListTask, BsThreeDotsVertical, BsSearch } from "react-icons/bs";
import { FaCheck, FaExclamationCircle } from "react-icons/fa";
import { FiPaperclip, FiSmile } from "react-icons/fi";
import { IoMdSend } from "react-icons/io";

const MainChat = ({ messages, selectedChat, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState("");
    const [showProfilePage, setShowProfilePage] = useState(false);
    const [showAvatarMenu, setShowAvatarMenu] = useState(false);
    const [showChatMenu, setShowChatMenu] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const closeProfilePage = () => setShowProfilePage(false);
    const [message, setMessage] = useState("");
    const chatMenuRef = useRef(null);
    const handleSend = () => {
        onSendMessage(newMessage);
        setNewMessage("");
    };
    const toggleChatMenu = () => setShowChatMenu(prev => !prev);
    const handleViewProfile = () => {
        setShowProfilePage(true);
        setShowAvatarMenu(false);
    };
    const handleContactProfileClick = () => {
        setProfileData(selectedChat);
        setShowProfileModal(true);
    };
    const handleSendMessage = () => {
        if (message.trim()) {
            setMessage("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    return (
        <div className="flex-1 flex flex-col">
            {/* Show Profile Component */}
            {showProfilePage ? (
                <Profilepage closeProfile={closeProfilePage} />
            ) : selectedChat ? (
                <>
                    <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between relative">
                        <div className="flex items-center">
                            <img
                                src={selectedChat.avatar}
                                alt={selectedChat.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="ml-4">
                                <h2 className="font-semibold">{selectedChat.name}</h2>
                                <p className="text-sm text-gray-600">{selectedChat.status}</p>
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <BsThreeDotsVertical className="text-gray-600 cursor-pointer" onClick={toggleChatMenu} />
                            {showChatMenu && (
                                <div
                                    ref={chatMenuRef}
                                    className="absolute top-16 right-4 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                                >
                                    <ul className="p-2">
                                        <li className="p-2 hover:bg-gray-100 cursor-pointer" onClick={handleContactProfileClick}>
                                            View Profile
                                        </li>
                                        <li className="p-2 hover:bg-gray-100 cursor-pointer">Delete Chat</li>
                                        <li className="p-2 hover:bg-gray-100 cursor-pointer">Block</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.type === "sent" ? "justify-end" : "justify-start"} mb-4`}
                            >
                                <div
                                    className={`p-3 rounded-lg max-w-xs ${msg.type === "sent" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
                                        }`}
                                >
                                    <p>{msg.content}</p>
                                    <div className="text-xs text-white-500 mt-1 flex items-center">
                                        {msg.time}
                                        {msg.type === "sent" && (
                                            <div className="ml-2 flex items-center">
                                                {msg.status === "sending" && <span>Đang gửi...</span>}
                                                {msg.status === "sent" && <FaCheck className="text-white ml-1" />}
                                                {msg.status === "delivered" && <FaCheck className="text-white ml-1" />}
                                                {msg.status === "read" && (
                                                    <div className="flex items-center ml-1">
                                                        {msg.readBy.map((user) => (
                                                            <img
                                                                key={user.id}
                                                                src={user.avatar}
                                                                alt="User avatar"
                                                                className="w-5 h-5 rounded-full border-2 border-white ml-1"
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                                {msg.status === "failed" && <FaExclamationCircle className="text-red-500 ml-1" />}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-white border-t border-gray-200 flex items-center">
                        <FiSmile className="text-gray-500 cursor-pointer mr-4" />
                        <FiPaperclip className="text-gray-500 cursor-pointer mr-4" />
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Gửi tin nhắn"
                            className="flex-1 px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button onClick={handleSendMessage} className="ml-4 text-blue-500 hover:text-blue-600">
                            <IoMdSend size={24} />
                        </button>
                    </div>
                </>
            ) : (
                <IntroductionPage />
            )}
        </div>
    );
}
export default MainChat;
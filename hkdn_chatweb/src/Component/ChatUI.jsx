import React, { useState, useEffect } from "react";
import { FiSend, FiPaperclip, FiSearch, FiMenu, FiX } from "react-icons/fi";
import { BsEmojiSmile } from "react-icons/bs";
import { IoMdNotifications } from "react-icons/io";

const ChatPage = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "John Doe",
            content: "Hey, how are you?",
            timestamp: "10:30 AM",
            isSender: true,
        },
        {
            id: 2,
            sender: "Jane Smith",
            content: "I'm good! How about you?",
            timestamp: "10:31 AM",
            isSender: false,
        },
        {
            id: 3,
            sender: "John Doe",
            content: "Great! Working on the new project.",
            timestamp: "10:32 AM",
            isSender: true,
        },
    ]);

    const [newMessage, setNewMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const users = [
        {
            id: 1,
            name: "Jane Smith",
            status: "online",
            avatar: "images.unsplash.com/photo-1494790108377-be9c29b29330",
        },
        {
            id: 2,
            name: "Mike Johnson",
            status: "offline",
            avatar: "images.unsplash.com/photo-1599566150163-29194dcaad36",
        },
        {
            id: 3,
            name: "Sarah Wilson",
            status: "online",
            avatar: "images.unsplash.com/photo-1517841905240-472988babdf9",
        },
    ];

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            const message = {
                id: messages.length + 1,
                sender: "John Doe",
                content: newMessage,
                timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                isSender: true,
            };
            setMessages([...messages, message]);
            setNewMessage("");
        }
    };

    useEffect(() => {
        if (newMessage) {
            setIsTyping(true);
            const timeout = setTimeout(() => setIsTyping(false), 1000);
            return () => clearTimeout(timeout);
        }
    }, [newMessage]);

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-xl font-bold text-indigo-600">ChatApp</span>
                        </div>
                        <div className="hidden md:flex items-center space-x-4">
                            <button
                                className="p-2 rounded-full hover:bg-gray-100"
                                aria-label="Notifications"
                            >
                                <IoMdNotifications className="w-6 h-6 text-gray-600" />
                            </button>
                            <img
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                                alt="Profile"
                                className="w-8 h-8 rounded-full"
                            />
                        </div>
                        <button
                            className="md:hidden p-2"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <FiX className="w-6 h-6" />
                            ) : (
                                <FiMenu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed top-16 left-0 right-0 bg-white shadow-md z-40 p-4">
                    <div className="flex flex-col space-y-4">
                        <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
                            <IoMdNotifications className="w-6 h-6 text-gray-600" />
                            <span>Notifications</span>
                        </button>
                        <div className="flex items-center space-x-2 p-2">
                            <img
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                                alt="Profile"
                                className="w-8 h-8 rounded-full"
                            />
                            <span>John Doe</span>
                        </div>
                    </div>
                </div>
            )}

            {/* User List Sidebar */}
            <div className="hidden md:flex flex-col w-80 bg-white border-r border-gray-200 pt-20">
                <div className="p-4">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {filteredUsers.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
                        >
                            <img
                                src={`https://${user.avatar}`}
                                alt={user.name}
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="ml-3">
                                <p className="font-medium">{user.name}</p>
                                <p
                                    className={`text-sm ${user.status === "online" ? "text-green-500" : "text-gray-500"}`}
                                >
                                    {user.status}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col pt-20">
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.isSender ? "justify-end" : "justify-start"} mb-4`}
                        >
                            <div
                                className={`max-w-[70%] rounded-lg p-3 ${message.isSender ? "bg-indigo-600 text-white" : "bg-white text-gray-900"} shadow-sm`}
                            >
                                <p>{message.content}</p>
                                <p
                                    className={`text-xs mt-1 ${message.isSender ? "text-indigo-200" : "text-gray-500"}`}
                                >
                                    {message.timestamp}
                                </p>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start mb-4">
                            <div className="bg-gray-200 rounded-lg p-3">
                                <p className="text-gray-500">Typing...</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Chat Input */}
                <form
                    onSubmit={handleSendMessage}
                    className="p-4 bg-white border-t border-gray-200"
                >
                    <div className="flex items-center space-x-2">
                        <button
                            type="button"
                            className="p-2 rounded-full hover:bg-gray-100"
                            aria-label="Attach file"
                        >
                            <FiPaperclip className="w-5 h-5 text-gray-600" />
                        </button>
                        <input
                            type="text"
                            placeholder="Type your message..."
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button
                            type="button"
                            className="p-2 rounded-full hover:bg-gray-100"
                            aria-label="Add emoji"
                        >
                            <BsEmojiSmile className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                            type="submit"
                            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            aria-label="Send message"
                        >
                            <FiSend className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatPage;
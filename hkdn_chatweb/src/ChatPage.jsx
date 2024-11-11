import React, { useState, useEffect } from "react";
import { BsThreeDotsVertical, BsHeart, BsHeartFill, BsCheckAll, BsCheck2 } from "react-icons/bs";
import { IoSendSharp } from "react-icons/io5";
import { RiGroupLine } from "react-icons/ri";
import axios from "axios";

const GroupChat = () => {
    const [messages, setMessages] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [showNewGroupModal, setShowNewGroupModal] = useState(false);
    const [newGroupData, setNewGroupData] = useState({ name: "", description: "" });
    const [error, setError] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [messageInput, setMessageInput] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            axios.get("http://localhost:8000/api/rooms", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(response => {
                if (response.data.success) {
                    setGroups(response.data.rooms);
                }
            })
            .catch(error => {
                console.error("Error fetching rooms:", error);
            });
        }
    }, []);

    const handleCreateGroup = () => {
        const token = localStorage.getItem("auth_token");
        const email = localStorage.getItem("user_email");
        if (!newGroupData.name.trim()) {
            setError("Group name is required.");
            return;
        }

        if (token && email) {
            axios.post("http://localhost:8000/api/createroom", {
                name: newGroupData.name,
                email: email
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                if (response.data.success) {
                    setGroups([...groups, response.data.room]);
                    setShowNewGroupModal(false);
                    setNewGroupData({ name: "", description: "" });
                    setError("");
                } else {
                    setError(response.data.message);
                }
            })
            .catch(error => {
                console.error("Error creating room:", error.response?.data || error);
                setError("Failed to create group. Please try again.");
            });
        }
    };

    const handleLikeMessage = (messageId) => {
        setMessages(messages.map(msg => {
            if (msg.id === messageId) {
                return {
                    ...msg,
                    likes: msg.isLiked ? msg.likes - 1 : msg.likes + 1,
                    isLiked: !msg.isLiked
                };
            }
            return msg;
        }));
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar - Group List */}
            <aside className="w-full md:w-1/4 bg-white border-r p-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold">Groups</h2>
                    <button
                        onClick={() => setShowNewGroupModal(true)}
                        className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        New Group
                    </button>
                </div>
                <div className="space-y-4 overflow-auto h-[calc(100vh-150px)]">
                    {groups.map(group => (
                        <div
                            key={group.id}
                            onClick={() => setSelectedGroup(group)}
                            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${selectedGroup?.id === group.id ? "bg-blue-50" : "hover:bg-gray-50"}`}
                        >
                            <img
                                src={`https://${group.avatar}`}
                                alt={group.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold">{group.name}</h3>
                                <p className="text-xs text-gray-500 truncate">{group.lastMessage}</p>
                            </div>
                            {group.unreadCount > 0 && (
                                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                    {group.unreadCount}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col">
                {selectedGroup ? (
                    <>
                        {/* Chat Header */}
                        <header className="bg-white border-b p-4">
                            <div className="flex items-center space-x-3">
                                <img
                                    src={`https://${selectedGroup.avatar}`}
                                    alt={selectedGroup.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <h2 className="font-semibold">{selectedGroup.name}</h2>
                                    <p className="text-sm text-gray-500">{selectedGroup.description}</p>
                                </div>
                            </div>
                        </header>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {messages.map(message => (
                                <div key={message.id} className="flex items-start space-x-3">
                                    <img
                                        src={`https://${message.sender.avatar}`}
                                        alt={message.sender.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <div className="flex-1 bg-white p-3 rounded-lg shadow-sm">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-semibold">{message.sender.name}</span>
                                            <span className="text-xs text-gray-500">{message.timestamp}</span>
                                        </div>
                                        <p className="mt-1">{message.content}</p>
                                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                                            <button onClick={() => handleLikeMessage(message.id)} className="flex items-center space-x-1">
                                                {message.isLiked ? <BsHeartFill className="text-red-500" /> : <BsHeart />}
                                                <span>{message.likes}</span>
                                            </button>
                                            <div className="flex items-center space-x-1">
                                                {message.status === "seen" ? <BsCheckAll className="text-blue-500" /> : <BsCheck2 />}
                                                <span>{message.status}</span>
                                            </div>
                                            <div className="relative group">
                                                <BsThreeDotsVertical className="cursor-pointer" />
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block">
                                                    <div className="py-1">
                                                        <button className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left">Edit</button>
                                                        <button className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left">Delete</button>
                                                        <button className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left">Reply</button>
                                                        <button className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left">Forward</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isTyping && <p className="text-sm text-gray-500 italic">Someone is typing...</p>}
                        </div>

                        {/* Message Input */}
                        <footer className="bg-white border-t p-4">
                            <div className="flex items-center space-x-3">
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                    <IoSendSharp size={20} />
                                </button>
                            </div>
                        </footer>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <RiGroupLine className="mx-auto text-gray-400" size={48} />
                            <p className="mt-2 text-gray-500">Select a group to start chatting</p>
                        </div>
                    </div>
                )}
            </main>

            {/* New Group Modal */}
            {showNewGroupModal && (
                <div className="fixed inset-0 bg-gray-700 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg w-96 shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Create New Group</h3>
                        {error && <p className="text-red-500 mb-2">{error}</p>}
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={newGroupData.name}
                                onChange={(e) => setNewGroupData({ ...newGroupData, name: e.target.value })}
                                placeholder="Group name"
                                className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <textarea
                                value={newGroupData.description}
                                onChange={(e) => setNewGroupData({ ...newGroupData, description: e.target.value })}
                                placeholder="Description (optional)"
                                className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            ></textarea>
                        </div>
                        <div className="flex justify-end mt-6 space-x-4">
                            <button
                                onClick={() => setShowNewGroupModal(false)}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateGroup}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupChat;

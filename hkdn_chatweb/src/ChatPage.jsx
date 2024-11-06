import React, { useState } from "react";
import { BsThreeDotsVertical, BsHeart, BsHeartFill, BsCheckAll, BsCheck2 } from "react-icons/bs";
import { IoSendSharp } from "react-icons/io5";
import { RiGroupLine } from "react-icons/ri";

const mockGroups = [
    {
        id: 1,
        name: "Design Team",
        description: "Team discussions about ongoing design projects",
        avatar: "images.unsplash.com/photo-1522071820081-009f0129c71c",
        lastMessage: "Hey everyone",
        unreadCount: 3
    },
    {
        id: 2,
        name: "Development Squad",
        description: "Technical discussions and code reviews",
        avatar: "images.unsplash.com/photo-1522202176988-66273c2fd55f",
        lastMessage: "PR is ready for review",
        unreadCount: 1
    }
];

const mockMessages = [
    {
        id: 1,
        sender: {
            id: 1,
            name: "John Doe",
            avatar: "images.unsplash.com/photo-1472099645785-5658abf4ff4e"
        },
        content: "Hello everyone! How's the progress going?",
        timestamp: "10:30 AM",
        status: "seen",
        likes: 2,
        seenBy: ["Alice", "Bob", "Charlie"],
        isLiked: false
    },
    {
        id: 2,
        sender: {
            id: 2,
            name: "Jane Smith",
            avatar: "images.unsplash.com/photo-1438761681033-6461ffad8d80"
        },
        content: "Making great progress on the dashboard redesign!",
        timestamp: "10:32 AM",
        status: "sent",
        likes: 3,
        seenBy: ["Alice"],
        isLiked: true
    }
];

const GroupChat = () => {
    const [messages, setMessages] = useState(mockMessages);
    const [groups, setGroups] = useState(mockGroups);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [showNewGroupModal, setShowNewGroupModal] = useState(false);
    const [newGroupData, setNewGroupData] = useState({ name: "", description: "" });
    const [isTyping, setIsTyping] = useState(false);
    const [messageInput, setMessageInput] = useState("");

    const handleCreateGroup = () => {
        const newGroup = {
            id: groups.length + 1,
            ...newGroupData,
            avatar: "images.unsplash.com/photo-1517245386807-bb43f82c33c4",
            lastMessage: "",
            unreadCount: 0
        };
        setGroups([...groups, newGroup]);
        setShowNewGroupModal(false);
        setNewGroupData({ name: "", description: "" });
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
            {/* Left Sidebar - Group List */}
            <div className="w-1/4 bg-white border-r border-gray-200 p-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Groups</h2>
                    <button
                        onClick={() => setShowNewGroupModal(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        New Group
                    </button>
                </div>

                <div className="space-y-4">
                    {groups.map(group => (
                        <div
                            key={group.id}
                            onClick={() => setSelectedGroup(group)}
                            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${selectedGroup?.id === group.id ? "bg-blue-50" : "hover:bg-gray-50"}`}
                        >
                            <img
                                src={`https://${group.avatar}`}
                                alt={group.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold">{group.name}</h3>
                                <p className="text-sm text-gray-500 truncate">{group.lastMessage}</p>
                            </div>
                            {group.unreadCount > 0 && (
                                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                    {group.unreadCount}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedGroup ? (
                    <>
                        {/* Chat Header */}
                        <div className="bg-white border-b border-gray-200 p-4">
                            <div className="flex items-center space-x-3">
                                <img
                                    src={`https://${selectedGroup.avatar}`}
                                    alt={selectedGroup.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <h2 className="font-bold">{selectedGroup.name}</h2>
                                    <p className="text-sm text-gray-500">{selectedGroup.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map(message => (
                                <div key={message.id} className="flex items-start space-x-3">
                                    <img
                                        src={`https://${message.sender.avatar}`}
                                        alt={message.sender.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-semibold">{message.sender.name}</span>
                                            <span className="text-xs text-gray-500">{message.timestamp}</span>
                                        </div>
                                        <div className="mt-1 bg-white p-3 rounded-lg shadow-sm">
                                            <p>{message.content}</p>
                                            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                                                <button
                                                    onClick={() => handleLikeMessage(message.id)}
                                                    className="flex items-center space-x-1"
                                                >
                                                    {message.isLiked ? (
                                                        <BsHeartFill className="text-red-500" />
                                                    ) : (
                                                        <BsHeart />
                                                    )}
                                                    <span>{message.likes}</span>
                                                </button>
                                                <div className="flex items-center space-x-1">
                                                    {message.status === "seen" ? (
                                                        <BsCheckAll className="text-blue-500" />
                                                    ) : (
                                                        <BsCheck2 />
                                                    )}
                                                    <span>{message.status}</span>
                                                </div>
                                                <div className="relative group">
                                                    <BsThreeDotsVertical className="cursor-pointer" />
                                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block">
                                                        <div className="py-1">
                                                            <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Edit</button>
                                                            <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Delete</button>
                                                            <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Reply</button>
                                                            <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Forward</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {message.seenBy.length > 0 && (
                                                <div className="mt-2 text-xs text-gray-500">
                                                    Seen by {message.seenBy.join(", ")}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="text-sm text-gray-500 italic">Someone is typing...</div>
                            )}
                        </div>

                        {/* Message Input */}
                        <div className="bg-white border-t border-gray-200 p-4">
                            <div className="flex items-center space-x-3">
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                />
                                <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
                                    <IoSendSharp size={20} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <RiGroupLine className="mx-auto text-gray-400" size={48} />
                            <p className="mt-2 text-gray-500">Select a group to start chatting</p>
                        </div>
                    </div>
                )}
            </div>

            {/* New Group Modal */}
            {showNewGroupModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h2 className="text-xl font-bold mb-4">Create New Group</h2>
                        <input
                            type="text"
                            placeholder="Group Name"
                            value={newGroupData.name}
                            onChange={(e) => setNewGroupData({ ...newGroupData, name: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
                        />
                        <textarea
                            placeholder="Group Description"
                            value={newGroupData.description}
                            onChange={(e) => setNewGroupData({ ...newGroupData, description: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
                        />
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowNewGroupModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateGroup}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                                Create Group
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupChat;

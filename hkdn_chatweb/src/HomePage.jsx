import React, { useState, useEffect, useRef } from "react";
import { IoMdSend } from "react-icons/io";
import { FiPaperclip, FiSmile } from "react-icons/fi";
import { BsThreeDotsVertical, BsSearch } from "react-icons/bs";
import { AiOutlineUserAdd, AiOutlineUsergroupAdd } from "react-icons/ai";
import { FaCheck, FaExclamationCircle } from "react-icons/fa";
import IntroPage from "./Component/IntroductionPage";
import Profile from "./Component/ProfilePage";
import SidebarIcons from "./Component/SidebarIcons";
import axios from "axios";
import GroupMemberModal from "./Component/GroupMemberModal";

const HomePage = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [message, setMessage] = useState("");
    const [showAvatarMenu, setShowAvatarMenu] = useState(false);
    const [showChatMenu, setShowChatMenu] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showProfilePage, setShowProfilePage] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const chatMenuRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState("");
    const avatarMenuRef = useRef(null);
    const sidebarMenuRef = useRef(null);
    const [showSidebarMenu, setShowSidebarMenu] = useState(false);

    const [showNewGroupModal, setShowNewGroupModal] = useState(false);
    const [error, setError] = useState("");
    const [newGroupData, setNewGroupData] = useState({ name: "", description: "" });
    const [groups, setGroups] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    const [showMemberModal, setShowMemberModal] = useState(false);
    const [roomUsers, setRoomUsers] = useState([]);

    const currentUser = {
        id: 0,
        name: "You",
        birthDate: "01/01/2000",
        phoneNumber: "+84 123 456 789",
        avatar: "https://inkythuatso.com/uploads/thumbnails/800/2023/03/6-anh-dai-dien-trang-inkythuatso-03-15-26-36.jpg",
    };


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

        const handleClickOutside = (event) => {
            if (sidebarMenuRef.current && !sidebarMenuRef.current.contains(event.target)) {
                setShowSidebarMenu(false);
            }
            if (chatMenuRef.current && !chatMenuRef.current.contains(event.target)) {
                setShowChatMenu(false);
            }
        };

        // test messages


        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const messages = [
        {
            id: 1,
            sender: "Friends",
            content: "Hi",
            time: "10:30 AM",
            status: "read",
            type: "received",
        },
        {
            id: 2,
            sender: "You",
            content: "Hi",
            time: "10:31 AM",
            status: "read",
            type: "sent",
            readBy: [
                {
                    id: 1,
                    avatar: "https://inkythuatso.com/uploads/thumbnails/800/2023/03/6-anh-dai-dien-trang-inkythuatso-03-15-26-36.jpg",
                },
            ],
        },
        {
            id: 3,
            sender: "You",
            content: "Hello!",
            time: "10:32 AM",
            status: "failed",
            type: "sent",
            readBy: [],
        },
    ];

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

    const handleContactProfileClick = () => {
        setProfileData(selectedChat); // Show selected contact profile from chat
        setShowProfileModal(true);
    };

    const closeProfileModal = () => {
        setShowProfileModal(false);
    };

    const toggleChatMenu = () => {
        setShowChatMenu((prev) => !prev);
    };
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
    const handleViewProfile = () => {
        console.log(showProfilePage);
        setShowProfilePage(true);
        setShowAvatarMenu(false);
    };

    const closeProfilePage = () => {
        setShowProfilePage(false);
    };

    const toggleAvatarMenu = (e) => {
        e.stopPropagation();
        setShowAvatarMenu((prev) => !prev);
    };

    const fetchRoomUser = () => {
        axios.get("http://localhost:8000/api/room/user", {
            params: {
                room_id: selectedChat.id,
            }
        }, {
            // headers: {
            //     Authorization: `Bearer ${token}`,
            // },
        })
        .then(response => {
            console.log(response.data)
            setRoomUsers(response.data.users);
        })
        .catch(error => {
            console.error("Error fetching members:", error);
        });
    }

    const openMemberModal = () => {
        setShowMemberModal(true);
        fetchRoomUser();
    }

    const closeMemberModal = () => {
        setShowMemberModal(false)
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target)) {
                setShowAvatarMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex h-full">
            <SidebarIcons setShowProfilePage={setShowProfilePage} ></SidebarIcons>
            <div className="w-1/4 bg-white border-r border-gray-200 relative">
                <div className="p-4 border-b border-gray-200 mb-2">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-semibold">Tin nhắn</h1>
                        <div className="flex items-center space-x-2">
                            <button title="Thêm bạn">
                                <AiOutlineUserAdd className="text-gray-600 hover:text-blue-500" />
                            </button>
                            <button title="Tạo nhóm" onClick={() => setShowNewGroupModal(true)}>
                                <AiOutlineUsergroupAdd className="text-gray-600 hover:text-blue-500" />
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm kiếm"
                            className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <BsSearch className="absolute right-3 top-3 text-gray-500" />
                    </div>
                </div>
                <div className="overflow-y-auto h-[calc(100vh-180px)]">
                    {groups.map((group) => (
                        <div
                            key={group.id}
                            onClick={() => setSelectedChat(group)}
                            className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${selectedChat?.id === group.id ? "bg-gray-50" : ""
                                }`}
                        >
                            <div className="relative">
                                <img
                                    src="https://cdn4.iconfinder.com/data/icons/social-media-3/512/User_Group-512.png"
                                    // src={group.avatar}
                                    alt={group.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <span
                                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${group.status === "online"
                                        ? "bg-green-500"
                                        : "bg-gray-500"
                                        }`}
                                ></span>
                            </div>
                            <div className="ml-4 flex-1">
                                <h2 className="font-semibold">{group.name}</h2>
                                <p className="text-sm text-gray-600 truncate">{group.lastMessage}</p>
                            </div>
                            <span className="text-xs text-gray-500">{group.time}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat */}
            <div className="flex-1 flex flex-col">
                {/* Show Profile Component */}
                {showProfilePage ? (
                    <Profile closeProfile={closeProfilePage} />
                ) : selectedChat ? (
                    <>
                        <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between relative">
                            <div className="flex items-center">
                                <img
                                    src="https://cdn4.iconfinder.com/data/icons/social-media-3/512/User_Group-512.png"
                                    // src={selectedChat.avatar}
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
                                            <li className="p-2 hover:bg-gray-100 cursor-pointer" onClick={openMemberModal}>Members</li>
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
                    <IntroPage />
                )}
            </div>
            {/* Profile */}
            {showProfileModal && profileData && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Profile</h2>
                        <div className="flex items-center mb-4">
                            <img
                                src={profileData.avatar}
                                alt={profileData.name}
                                className="w-16 h-16 rounded-full object-cover mr-4"
                            />
                            <div>
                                <p><strong>Name:</strong> {profileData.name}</p>
                                <p><strong>Ngày sinh:</strong> {profileData.birthDate}</p>
                                <p><strong>Số điện thoại:</strong> {profileData.phoneNumber}</p>
                            </div>
                        </div>
                        <button
                            onClick={closeProfileModal}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

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


            <GroupMemberModal
                isShowMemberModal={showMemberModal}
                closeModal={closeMemberModal} 
                users={roomUsers} 
                group={selectedChat}
                updateRoomUser={fetchRoomUser} />
            
        </div>
    );
};

export default HomePage;
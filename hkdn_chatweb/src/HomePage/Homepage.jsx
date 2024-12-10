import React, { useState, useEffect, useRef } from "react";
import { IoMdSend } from "react-icons/io";
import { FiPaperclip, FiSmile } from "react-icons/fi";
import { BsCheck2All, BsThreeDotsVertical, BsSearch, BsHeart, BsHeartFill, BsCheckAll, BsCheck2 } from "react-icons/bs";
import { AiOutlineUserAdd, AiOutlineGroup } from "react-icons/ai";
import { RiGroupLine } from "react-icons/ri";
import axios from "axios";

const ChatApp = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [showSidebarMenu, setShowSidebarMenu] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState(null); 
  const sidebarMenuRef = useRef(null);
  const chatMenuRef = useRef(null);

  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [error, setError] = useState("");
  const [newGroupData, setNewGroupData] = useState({ name: "", description: "" });
  const [groups, setGroups] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [messageInput, setMessageInput] = useState("");

  const [messages, setMessages] = useState([]);

  const currentUser = {
    id: 0,
    name: "You",
    birthDate: "01/01/2000",
    phoneNumber: "+84 123 456 789",
    avatar: "",
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

  const handleProfileClick = () => {
    setProfileData(currentUser); // Show current user profile from sidebar
    setShowProfileModal(true);
    setShowSidebarMenu(false);
  };

  const handleContactProfileClick = () => {
    setProfileData(selectedChat); // Show selected contact profile from chat
    setShowProfileModal(true);
    setShowChatMenu(false);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
  };

  const toggleSidebarMenu = () => {
    setShowSidebarMenu((prev) => !prev);
  };

  const toggleChatMenu = () => {
    setShowChatMenu((prev) => !prev);
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
    setMessages([
      {
        id: 1,
        content: "Hi",
        timestamp: "10:30 AM",
        status: "read",
        type: "received",
        isLiked: false,
        likes: 0,
        sender: {
          name: "Friend",
        },
      },
      {
        id: 2,
        content: "Hello",
        timestamp: "10:31 AM",
        status: "read",
        type: "sent",
        isLiked: false,
        likes: 0,
        sender: {
          name: "You",
        },
      }
    ]);

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r border-gray-200 relative">
        <div className="p-4 border-b border-gray-200 mb-2">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">Tin nhắn</h1>
            <div className="flex items-center space-x-2">
              {/* <button title="Thêm bạn">
                <AiOutlineUserAdd className="text-gray-600 hover:text-blue-500" />
              </button> */}
              <button 
                onClick={() => setShowNewGroupModal(true)}
                title="Tạo nhóm">
                <AiOutlineGroup className="text-gray-600 hover:text-blue-500" />
              </button>
              <BsThreeDotsVertical
                className="text-gray-600 cursor-pointer"
                onClick={toggleSidebarMenu}
              />
              {showSidebarMenu && (
                <div
                  ref={sidebarMenuRef}
                  className="absolute top-16 right-0 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                >
                  <ul className="p-2">
                    <li className="p-2 hover:bg-gray-100 cursor-pointer" onClick={handleProfileClick}>Profile</li>
                    <li className="p-2 hover:bg-gray-100 cursor-pointer">Friends</li>
                    <li className="p-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                    <li className="p-2 hover:bg-gray-100 cursor-pointer">Log out</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
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
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
                selectedChat?.id === group.id ? "bg-gray-50" : ""
              }`}
            >
              <div className="relative">
                <img
                  src={group.avatar ? group.avatar : "https://via.placeholder.com/40"}
                  alt={group.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {group.unreadCount > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        {group.unreadCount}
                    </span>
                )}
              </div>
              <div className="ml-4 flex-1">
                <h2 className="font-semibold">{group.name}</h2>
                <p className="text-xs text-gray-500 truncate">{group.description || "No description available."}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between relative">
              <div className="flex items-center">
                <img
                  src={selectedChat.avatar ? selectedChat.avatar : "https://via.placeholder.com/40"}
                  alt={selectedChat.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h2 className="font-semibold">{selectedChat.name}</h2>
                  <p className="text-sm text-gray-500">{selectedChat.description || "No description available."}</p>
                </div>
              </div>
              {/* <div className="flex space-x-4">
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
              </div> */}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map(message => (
                  <div key={message.id} className="flex items-start space-x-3">
                      <img
                          src={message.sender.avatar ? `https://${message.sender.avatar}` : "https://via.placeholder.com/40"}
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
                                  <div className="absolute left-0 w-48 z-50 bg-white rounded-md shadow-lg border hidden group-hover:block">
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
          <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                  <RiGroupLine className="mx-auto text-gray-400" size={48} />
                  <p className="mt-2 text-gray-500">Select a group to start chatting</p>
              </div>
          </div>
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

export default ChatApp;

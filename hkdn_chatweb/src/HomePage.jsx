import React, { useState, useEffect, useRef } from "react";
import { IoMdSend } from "react-icons/io";
import { FiPaperclip, FiSmile } from "react-icons/fi";
import { BsCheck2All, BsThreeDotsVertical, BsSearch } from "react-icons/bs";
import { AiOutlineUserAdd, AiOutlineGroup } from "react-icons/ai";

const HomePage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [showSidebarMenu, setShowSidebarMenu] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState(null); 
  const sidebarMenuRef = useRef(null);
  const chatMenuRef = useRef(null);


  const currentUser = {
    id: 0,
    name: "You",
    birthDate: "01/01/2000",
    phoneNumber: "+84 123 456 789",
    avatar: "",
  };

  const contacts = [
    {
      id: 1,
      name: "Cường",
      status: "online",
      avatar: "https://inkythuatso.com/uploads/thumbnails/800/2023/03/6-anh-dai-dien-trang-inkythuatso-03-15-26-36.jpg",
      lastMessage: "Hi",
      time: "10:30 AM",
      birthDate: "06/09/2003",
      phoneNumber: "+84 935 089 651",
    },
    {
      id: 2,
      name: "Vinh",
      status: "offline",
      avatar: "https://inkythuatso.com/uploads/thumbnails/800/2023/03/6-anh-dai-dien-trang-inkythuatso-03-15-26-36.jpg",
      lastMessage: "Hi",
      time: "09:45 AM",
    },
    {
      id: 3,
      name: "Thái",
      status: "away",
      avatar: "https://inkythuatso.com/uploads/thumbnails/800/2023/03/6-anh-dai-dien-trang-inkythuatso-03-15-26-36.jpg",
      lastMessage: "Hi",
      time: "Yesterday",
    },
  ];

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarMenuRef.current && !sidebarMenuRef.current.contains(event.target)) {
        setShowSidebarMenu(false);
      }
      if (chatMenuRef.current && !chatMenuRef.current.contains(event.target)) {
        setShowChatMenu(false);
      }
    };
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
              <button title="Thêm bạn">
                <AiOutlineUserAdd className="text-gray-600 hover:text-blue-500" />
              </button>
              <button title="Tạo nhóm">
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
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedChat(contact)}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
                selectedChat?.id === contact.id ? "bg-gray-50" : ""
              }`}
            >
              <div className="relative">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    contact.status === "online"
                      ? "bg-green-500"
                      : contact.status === "away"
                      ? "bg-yellow-500"
                      : "bg-gray-500"
                  }`}
                ></span>
              </div>
              <div className="ml-4 flex-1">
                <h2 className="font-semibold">{contact.name}</h2>
                <p className="text-sm text-gray-600 truncate">{contact.lastMessage}</p>
              </div>
              <span className="text-xs text-gray-500">{contact.time}</span>
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
                  className={`flex ${
                    msg.type === "sent" ? "justify-end" : "justify-start"
                  } mb-4`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-xs ${
                      msg.type === "sent"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <div className="text-xs text-white-500 mt-1 flex items-center">
                      {msg.time}
                      {msg.type === "sent" && (
                        <BsCheck2All
                          className={`ml-1 ${
                            msg.status === "read" ? "text-whitee-400" : "text-gray-400"
                          }`}
                        />
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
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a chat to start messaging</p>
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
    </div>
  );
};

export default HomePage;

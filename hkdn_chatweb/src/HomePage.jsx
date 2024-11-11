import React, { useState, useEffect, useRef } from "react";
import { IoMdSend } from "react-icons/io";
import { FiPaperclip, FiSmile } from "react-icons/fi";
import { BsChatDotsFill, BsPeopleFill, BsGearFill, BsArchiveFill, BsListTask, BsThreeDotsVertical, BsSearch } from "react-icons/bs";
import { AiOutlineUserAdd, AiOutlineUsergroupAdd } from "react-icons/ai";
import { FaCheck, FaExclamationCircle } from "react-icons/fa";
import IntroPage from "./IntroPage";
import Profile from "./Profile";

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
  
  const currentUser = {
    id: 0,
    name: "You",
    birthDate: "01/01/2000",
    phoneNumber: "+84 123 456 789",
    avatar: "https://inkythuatso.com/uploads/thumbnails/800/2023/03/6-anh-dai-dien-trang-inkythuatso-03-15-26-36.jpg",
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
      status: "online",
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
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      {/* Sidebar */}
      <div className="w-16 h-screen bg-blue-600 flex flex-col items-center py-4">
        {/* Avatar and Menu */}
        <div className="relative">
          <img
            src={currentUser.avatar || "https://via.placeholder.com/150"}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover cursor-pointer mb-4"
            onClick={toggleAvatarMenu}
          />
          {showAvatarMenu && (
            <div className="absolute top-12 left-0 w-48 bg-white shadow-lg rounded-lg z-10">
              <div className="p-4 border-b">
                <h2 className="font-semibold">{currentUser.name}</h2>
              </div>
              <ul className="p-2">
                <li className="p-2 hover:bg-gray-100 cursor-pointer" onClick={handleViewProfile}>
                  Hồ sơ của bạn
                </li>
                <li className="p-2 hover:bg-gray-100 cursor-pointer">Cài đặt</li>
                <li className="p-2 hover:bg-gray-100 cursor-pointer text-red-500">Đăng xuất</li>
              </ul>
            </div>
          )}
        </div>
        {/* Icon Tin nhắn */}
        <button title="Tin nhắn" className="text-white hover:bg-blue-500 p-3 rounded-lg mb-2">
          <BsChatDotsFill size={24} />
        </button>

        {/* Icon Danh bạ */}
        <button title="Danh bạ" className="text-white hover:bg-blue-500 p-3 rounded-lg mb-2">
          <BsPeopleFill size={24} />
        </button>

        {/* Đường kẻ ngang */}
        <div className="w-10 h-px bg-white my-4"></div>

        {/* Icon Lưu trữ */}
        <button title="Lưu trữ" className="text-white hover:bg-blue-500 p-3 rounded-lg mb-2">
          <BsArchiveFill size={24} />
        </button>

        {/* Icon Công việc */}
        <button title="Công việc" className="text-white hover:bg-blue-500 p-3 rounded-lg mb-2">
          <BsListTask size={24} />
        </button>

        {/* Icon Cài đặt */}
        <button title="Cài đặt" className="text-white hover:bg-blue-500 p-3 rounded-lg">
          <BsGearFill size={24} />
        </button>
      </div>
      <div className="w-1/4 bg-white border-r border-gray-200 relative">
        <div className="p-4 border-b border-gray-200 mb-2">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">Tin nhắn</h1>
            <div className="flex items-center space-x-2">
              <button title="Thêm bạn">
                <AiOutlineUserAdd className="text-gray-600 hover:text-blue-500" />
              </button>
              <button title="Tạo nhóm">
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
          {filteredContacts.map((contact) => (
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
        {/* Show Profile Component */}
        {showProfilePage ? (
          <Profile closeProfile={closeProfilePage} />
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
                  className={`p-3 rounded-lg max-w-xs ${
                    msg.type === "sent" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
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
    </div>
  );
};

export default HomePage;
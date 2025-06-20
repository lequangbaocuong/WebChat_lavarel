import React, { useState, useEffect, useRef } from "react";
import { IoMdSend } from "react-icons/io";
import { MdVideocam, MdCall, MdMoreVert } from 'react-icons/md';
import { FiPaperclip, FiSmile } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai"
import { BsThreeDotsVertical, BsSearch } from "react-icons/bs";
import { AiOutlineUserAdd, AiOutlineUsergroupAdd } from "react-icons/ai";
import { FaCheck, FaExclamationCircle } from "react-icons/fa";
import IntroPage from "./Component/IntroductionPage";
import Profile from "./Component/ProfilePage";
import { BiPin } from "react-icons/bi";
import SidebarIcons from "./Component/SidebarIcons";
import NotificationPopup from './Component/NotificationPopup'
import axios from "axios";
import GroupMemberModal from "./Component/GroupMemberModal";

import { FaSync } from "react-icons/fa";

import Echo from "./echo"

import PinnedMessagesForm from "./Component/PinnedMessagesForm";
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
    const messagesEndRef = useRef(null);
    const [showNewGroupModal, setShowNewGroupModal] = useState(false);
    const [error, setError] = useState("");
    const [newGroupData, setNewGroupData] = useState({ name: "", description: "" });
    const [groups, setGroups] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [username, setUsername] = useState('');    const [typingUsers, setTypingUsers] = useState([]);

    const [showMemberModal, setShowMemberModal] = useState(false);
    const [roomUsers, setRoomUsers] = useState([]);

    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [formPosition, setFormPosition] = useState({ top: 0, left: 0 });    const [messageQueue, setMessageQueue] = useState([]); // Hàng chờ tin nhắn
    const [isProcessing, setIsProcessing] = useState(false); // Trạng thái xử lý hàng chờ
    const [callRoom, setCallRoom] = useState(null);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setMessageInput(selectedFile.name);
        if (selectedFile) {
            setFile(selectedFile);
        }
    };
    const isImageFile = (filePath) => {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        const fileExtension = filePath.split('.').pop().toLowerCase();
        return imageExtensions.includes(fileExtension);
    };
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]); // 
    const handleUpload = async () => {
        if (!file || !selectedChat) return;

        setUploading(true);
        setUploadProgress(0); // Reset progress

        try {
            const uploadedMessage = await uploadFile(selectedChat.id, file, (progressEvent) => {
                const progress = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                setUploadProgress(progress);
            });
            setFile(null);

            // Clear file input after upload
            // Bạn có thể cập nhật thêm trạng thái hoặc thực hiện hành động khác sau khi upload thành công
            console.log('File uploaded successfully:', uploadedMessage);
            setMessages((prevMessages) => [...prevMessages, uploadedMessage]);
        } catch (error) {
            console.error("Error during file upload:", error.message);
            // Có thể hiển thị thông báo lỗi cho người dùng ở đây
        } finally {
            setUploading(false);
        }
    };

    const uploadFile = async (roomId, file, onProgress) => {
        const token = localStorage.getItem("auth_token");

        if (!file || !token) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("content", ""); // Đảm bảo content không bị null nếu cần

        try {
            const response = await axios.post(
                `http://localhost:8000/api/rooms/${roomId}/upload`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                        "X-Socket-ID": window.Echo.socketId()
                    },
                    onUploadProgress: onProgress, // Theo dõi tiến độ upload
                }
            );

            if (response.data.success) {

                setMessages((prevMessages) => [...prevMessages, response.data.message]);
                fetchMessages(selectedChat.id);
                return response.data.message;
                // Trả về thông tin tin nhắn đã upload
            } else {
                throw new Error(response.data.message || 'File upload failed');
            }
        } catch (error) {
            console.error("Error uploading file:", error.response?.data || error.message);
            throw new Error("File upload failed: " + (error.response?.data?.message || error.message));
        }
    };

    const currentUserId = localStorage.getItem("user_id"); // Lấy user_id từ localStorage
    useEffect(() => {
        console.log("Current User ID:", currentUserId);
        console.log("Messages:", messages);
    }, [messages]); // Kiểm tra mỗi khi messages thay đổi
    const buttonRefs = useRef({});
    const [activeMessage, setActiveMessage] = useState(null);
    const [showOptions, setShowOptions] = useState(null);
    const moreButtonRef = useRef(null);
    const [messageId2, setMessageId2] = useState(null);
    const toggleOptions = (messageId) => {

        setMessageId2(messageId);

        setActiveMessage(prevActiveMessage => {
            if (prevActiveMessage === messageId) {
                // Đóng form nếu đã mở
                return null;
            } else {
                const button = buttonRefs.current[messageId];
                if (button) {
                    const rect = button.getBoundingClientRect();
                    setFormPosition({
                        top: rect.top + window.scrollY, // Thêm scrollY để tính chính xác trong viewport
                        left: rect.left - 120 - 8, // Hiển thị form bên cạnh nút
                    });
                }
                return messageId; // Mở form cho tin nhắn này
            }
        });
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
                        localStorage.setItem('message', response.data.message);
                        setShowNotification(true);
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


    const closeProfilePage = () => {
        setShowProfilePage(false);
    };


    // Hàm để lấy thành viên nhóm
    const fetchRoomUser = (roomId) => {
        const token = localStorage.getItem("auth_token");
        axios.get(`http://localhost:8000/api/room/${roomId}/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(response => {
                setRoomUsers(response.data)
                console.log("Users in room:", response.data);
            })
            .catch(error => {
                console.error("Error fetching users in room:", error);
            });
    }

    const fetchMessages = async (roomId) => {
        try {
            const token = localStorage.getItem("auth_token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await axios.get(`http://localhost:8000/api/rooms/${roomId}/messages`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setMessages(
                    response.data.messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

                ); // Sort by timestamp
            }
        } catch (error) {
            console.error("Error fetching messages:", error.message);
        }
    };
    const pinMessage = async (messageId) => {
        const token = localStorage.getItem("auth_token");
        const id = messageId2;
        console.log(id);
        try {
            // Gửi yêu cầu pin tin nhắn
            const response = await axios.post(
                `http://localhost:8000/api/rooms/${selectedChat.id}/messages/${id}/pin`,
                {}, // Dữ liệu gửi đi nếu cần (trong trường hợp này là một object rỗng)
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Kiểm tra nếu pin thành công
            if (response.data.success) {
                setMessages((prevMessages) =>
                    prevMessages.map((message) =>
                        message.id === messageId
                            ? { ...message, pinned: true } // Đánh dấu tin nhắn đã ghim
                            : message
                    )
                );
                setActiveMessage(null); // Đóng form nếu có
            } else {
                console.error("Không thể ghim tin nhắn");
            }
        } catch (err) {
            console.error("Lỗi khi ghim tin nhắn:", err);
        }
    };




    // Thiết lập interval để cập nhật tin nhắn mỗi 3 giây

    useEffect(() => {
        const interval = setInterval(() => {
            // Gọi fetchMessages mỗi 3 giây để lấy tin nhắn mới
            if (selectedChat) {
                fetchMessages(selectedChat.id);  // Gọi hàm để lấy tin nhắn mới
            }
        }, 30000); // 3 giây

        return () => clearInterval(interval);
    }, [selectedChat]);


    const handleInputChange = (e) => {
        setMessage(e.target.value);

        if (!isTyping) {
            setIsTyping(true);
            // Phát sự kiện "đang nhập" đến server
            window.Echo.private(`room.${selectedChat.id}`).whisper("typing", { userId: localStorage.getItem("user_id") });
        }

        // Đặt lại thời gian "ngừng nhập"
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            setIsTyping(false);
            // Phát sự kiện "ngừng nhập" đến server
            window.Echo.private(`room.${selectedChat.id}`).whisper("stoppedTyping", { userId: localStorage.getItem("user_id") });
        }, 1000); // 1 giây sau khi ngừng gõ
    };

    const handleTypingStart = () => {
        setIsTyping(true);

        // Clear timeout nếu người dùng tiếp tục nhập
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        // Đặt timeout để ngừng "đang nhập" sau 1.5 giây không nhập
        setTypingTimeout(
            setTimeout(() => {
                setIsTyping(false);
            }, 1500)
        );
    };


    const addToQueue = (message) => {
        setMessageQueue((prevQueue) => [...prevQueue, message]);
    };

    // Hàm xử lý hàng chờ
    const processQueue = async () => {
        if (messageQueue.length === 0 || isProcessing) return;
    
        setIsProcessing(true);
        const message = messageQueue[0]; // Lấy tin nhắn đầu tiên trong hàng chờ
    
        try {
            console.log("Đang gửi tin nhắn:", message);
            // Giả lập gửi tin nhắn lên server với delay 1s
            await new Promise((resolve) =>
                setTimeout(async () => {
                    await fetch(`http://localhost:8000/api/rooms/${selectedChat.id}/messages`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ message }),
                    });
                    resolve(); // Kết thúc delay
                }, 1000)
            );
    
            console.log("Tin nhắn đã gửi:", message);
        } catch (error) {
            console.error("Lỗi khi gửi tin nhắn:", error);
        }
    
        // Xóa tin nhắn khỏi hàng chờ và tiếp tục xử lý
        setMessageQueue((prevQueue) => prevQueue.slice(1));
        setIsProcessing(false);
    };

    // Lắng nghe và xử lý hàng chờ
    useEffect(() => {
        if (!isProcessing) {
            processQueue();
        }
    }, [messageQueue, isProcessing]);

    const handleSendMessage = async () => {
        if (!selectedChat || !messageInput.trim()) return;

        const currentUserId = localStorage.getItem("user_id");
        let message = {
            id: 0,
            user_id: currentUserId,
            room_id: selectedChat.id,
            content: messageInput,
            created_at: "",
            updated_at: "",
            type: "text",
            file_path: null,
            user: {
                id: currentUserId,
            }
        }
        let messageClones = [...messages];
        messageClones.push(message);

        setMessages((prevMessages) => [...prevMessages, message]);
        if (messageInput.trim() === "") return;
        addToQueue(messageInput); // Thêm tin nhắn vào hàng chờ
        setMessageInput("");

        const token = localStorage.getItem("auth_token");
        try {
            const response = await axios.post(
                `http://localhost:8000/api/rooms/${selectedChat.id}/messages`,
                { content: messageInput },
                { headers: { Authorization: `Bearer ${token}`, "X-Socket-ID": window.Echo.socketId() } }
            );

            console.log(response.data); // Kiểm tra dữ liệu phản hồi

            if (response.data.success) {
                message.id = response.data.data.id;
                message.created_at = response.data.data.created_at;
                message.updated_at = response.data.data.updated_at;
                setMessages(messageClones);
                // setMessages((prevMessages) => [...prevMessages, response.data.data]);  // Thêm tin nhắn mới vào state
                // setMessageInput("");
            }
            // Ngừng trạng thái "đang nhập" khi gửi tin nhắn thành công
            setIsTyping(false); // Tắt trạng thái đang nhập
        } catch (error) {
            console.error("Error sending message:", error.response?.data || error);
        }
    };

    const syncMessage = async (e) => {
        setMessages((prevMessages) => [...prevMessages, e.message]);
    }

    useEffect(() => {
        if (selectedChat) {
            window.Echo.private(`room.${selectedChat.id}`)
                .listen("MessageCreated", (e) => {
                    syncMessage(e)
                })
        }
    }, [selectedChat])


    function addRoomUsers(newUsers) {
        newUsers = newUsers || []; // Fallback to an empty array if newUsers is undefined or null

        if (Array.isArray(newUsers)) {
            newUsers.forEach(user => {
                // Add the user to the room (your existing logic)
                console.log(user); // Just for debugging
            });
        } else {
            console.error("newUsers is still not an array:", newUsers);
            // Optionally handle the error case (e.g., show an error message)
        }
        fetchRoomUser(selectedChat.id);

    }

    const removeRoomUser = (user) => {
        setRoomUsers(roomUsers.filter(u => u.id !== user.id))
    }

    const openMemberModal = () => {
        setShowMemberModal(true);
    }

    const closeMemberModal = () => {
        setShowMemberModal(false)
    }
    const handleSendandUpload = () => {
        if (messageInput.trim()) {
            handleSendMessage();
        }
        if (file) {
            handleUpload();
        }
    };

    let callWindowRef = null;

    const makeCall = (useVideo) => {
        if (callWindowRef == null || callWindowRef.closed) {
            callWindowRef = window.open(
                `${window.location.origin}/video-call?roomId=${selectedChat.id}&video=${useVideo}`,
                'callWindow'
            );
        } else {
            callWindowRef.focus();
        }
    }


    useEffect(() => {
        if (selectedChat) {
            fetchMessages(selectedChat.id); // Lấy tin nhắn của nhóm đã chọn
            fetchRoomUser(selectedChat.id); // Lấy thành viên nhóm đã chọn
            // fetchCallRoom(selectedChat.id);
        }
    }, [selectedChat]); // Lắng nghe sự thay đổi của selectedChat

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
    const [isFormVisible, setFormVisible] = useState(false);
    const handleShowForm = (roomId) => {
        console.log(roomId);
        setFormVisible(true); // Hiển thị form
    };
    const handleCloseForm = () => {
        fetchMessages(selectedChat.id);
        setFormVisible(false); // Ẩn form
    };

    return (
        <div className="flex h-full">
            <SidebarIcons setShowProfilePage={setShowProfilePage} ></SidebarIcons>
            <div className="w-1/4 bg-white border-r border-gray-200 relative ">
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
                    {groups.map((group, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedChat(group)}
                            className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${selectedChat?.id === group.id ? "bg-gray-50" : ""
                                }`}
                        >
                            <div className="relative">
                                <img
                                    src={""}
                                    // src={group.avatar}
                                    alt={group.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/gr.png";
                                    }}
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
            <div className="flex-1 flex flex-col  h-screen">
                {/* Show Profile Component */}
                {showProfilePage ? (
                    <Profile closeProfile={closeProfilePage} />
                ) : selectedChat ? (
                    <>
                        {/* Chat Header */}
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
                                <BiPin onClick={() => handleShowForm(selectedChat.id)} size={22} className="text-gray-600 cursor-pointer text-lg" />
                                {isFormVisible && (
                                    <PinnedMessagesForm
                                        roomId={selectedChat.id} // Truyền ID phòng sang form
                                        onClose={handleCloseForm} // Đóng form
                                    />
                                )}
                                <MdCall onClick={() => { makeCall(false) }} className="text-gray-600 cursor-pointer text-lg" />
                                <MdVideocam onClick={() => { makeCall(true) }} className="text-gray-600 cursor-pointer text-lg" />
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

                        {/* Display Messages */}
                        <div className="flex-1 flex flex-col overflow-y-auto pl-4 bg-gray-50">
                            <div
                                className="flex-1 p-4 overflow-y-auto space-y-4"

                            >
                                {messages.map((message) => {
                                    if (!message.user_id || !message.user) {
                                        console.error('Message or user data is incomplete', message);
                                        return null; // Nếu không có user_id hoặc user, bỏ qua tin nhắn này
                                    }
                                    const currentUserId = localStorage.getItem("user_id");
                                    const isCurrentUser = Number(message.user_id) === Number(currentUserId);
                                    const isSending = message.created_at === "";

                                    return (
                                        <div
                                            key={message.id}
                                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
                                        >
                                            <div
                                                className={`max-w-[70%] rounded-lg p-3 shadow-sm ${isCurrentUser
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-white text-gray-900'
                                                    } ${message.is_pinned ? 'border-2 border-yellow-400' : ''}`}
                                            >

                                                <p className="text-sm text-indigo-500 font-semibold mb-1">
                                                    {message.user.username}
                                                </p>

                                                <p>{message.content}</p>
                                                {message.file_path && (
                                                    <div className="mt-2 w-40">
                                                        {isImageFile(message.file_path) ? (
                                                            <img
                                                                src={`http://localhost:8000/storage/${message.file_path}`}
                                                                alt="Sent file"
                                                                className="max-w-full rounded-lg"
                                                            />
                                                        ) : (
                                                            <a
                                                                href={`http://localhost:8000/storage/${message.file_path}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-500 hover:underline"
                                                            >
                                                                Download File
                                                            </a>
                                                        )}
                                                    </div>
                                                )}

                                                <p className={`text-xs mt-1 ${isCurrentUser ? 'text-indigo-200' : 'text-gray-500'}`}>
                                                    {
                                                        isSending ? "Sending" : new Date(message.created_at).toLocaleTimeString()
                                                    }

                                                </p>

                                                <div className="flex space-x-4">


                                                    {/* Nút trái tim */}
                                                    <button className="w-5 h-5 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-red-500 shadow-lg hover:from-pink-600 hover:to-red-600 transform hover:scale-110 transition">
                                                        <AiFillHeart size={15} className="text-white" />
                                                    </button>
                                                    <button
                                                        ref={(el) => (buttonRefs.current[message.id] = el)} // Gắn ref cho nút More
                                                        onClick={() => toggleOptions(message.id)}
                                                        className="w-5 h-5 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg hover:from-purple-600 hover:to-blue-600 transform hover:scale-110 transition"
                                                    >
                                                        <MdMoreVert size={15} className="text-white" />
                                                    </button>
                                                    {activeMessage && (
                                                        <div
                                                            style={{
                                                                position: "fixed",
                                                                top: `${formPosition.top}px`,
                                                                left: `${formPosition.left}px`,
                                                            }}
                                                            className="bg-white border shadow-md rounded-lg py-2 px-4 z-50"
                                                        >
                                                            <button
                                                                onClick={() => pinMessage(message.id)}
                                                                className="block text-sm text-gray-700 hover:bg-gray-200 px-2 py-1 rounded"

                                                            >
                                                                Ghim

                                                            </button>
                                                            <button
                                                                className="block text-sm text-gray-700 hover:bg-gray-200 px-2 py-1 rounded"
                                                                onClick={() => console.log("Recall message")}
                                                            >
                                                                Thu hồi
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div >
                                    );
                                })}


                                <div ref={messagesEndRef} />
                            </div >
                        </div >
                        {/* Hiển thị trạng thái "đang nhập" */}
                        {
                            isTyping && (
                                <div className="typing-indicator text-gray-500 italic text-sm mb-2">
                                    Đang nhập...
                                </div>
                            )
                        }
                         {/* Hiển thị hàng chờ tin nhắn */}
                        <div className="message-queue text-sm text-gray-500 mb-4">
                            <strong>Hàng chờ:</strong>{" "}
                            {messageQueue.length > 0
                                ? messageQueue.join(", ")
                                : "Không có tin nhắn trong hàng chờ."}
                        </div>
                        {/* Input for Sending Messages */}
                        <div className="p-4 bg-white border-t border-gray-200 flex items-center">
                            <FiSmile className="text-gray-500 cursor-pointer mr-4" />
                            {/* File Input */}
                            <label htmlFor="file-upload" className="cursor-pointer mr-4">
                                <FiPaperclip className="text-gray-500" />
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="*/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                            {/* ProgressBar */}
                            {uploading && (
                                <div className="flex items-center w-full mr-4">
                                    <div className="w-full bg-gray-200 rounded-lg h-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-lg"
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                    <span className="ml-2 text-sm text-gray-600">{uploadProgress}%</span>
                                </div>
                            )}

                            <input
                                type="text"
                                value={messageInput}
                                onChange={(e) => {
                                    setMessageInput(e.target.value);
                                    handleTypingStart(); // Bắt đầu nhập
                                }}
                                onKeyUp={(e) => {
                                    if (e.key === "Enter") {
                                        handleSendandUpload(); // Gửi tin nhắn
                                    }
                                }}
                                placeholder="Gửi tin nhắn"
                                className="flex-1 px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button

                                onClick={handleSendandUpload}
                                disabled={(!messageInput.trim() && !file) || uploading} // Enable if there's either a message or a file
                                className="ml-4 text-blue-500 hover:text-blue-600"
                            >
                                <IoMdSend size={24} />
                            </button>
                        </div>
                    </>
                ) : (
                    <IntroPage />
                )}
            </div >

            {/* Profile */}
            {
                showProfileModal && profileData && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-105">
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
                )
            }

            {
                showNewGroupModal && (
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
                )
            }


            <GroupMemberModal
                isShowMemberModal={showMemberModal}
                closeModal={closeMemberModal}
                users={roomUsers}
                group={selectedChat}
                addRoomUsers={addRoomUsers}
                removeRoomUser={removeRoomUser}

            />
            {showNotification && (<NotificationPopup message={localStorage.getItem('message')} />)}
        </div >
    );
};

export default HomePage;
import React, { useState } from "react";
import { BsChatDotsFill, BsPeopleFill, BsGearFill, BsArchiveFill, BsListTask, BsThreeDotsVertical, BsSearch } from "react-icons/bs";
import { Link } from "react-router-dom";






const SidebarIcons = ({ setShowProfilePage }) => {
    const handleProfileClick = () => {
        setShowProfilePage(true);
    };
    const [showAvatarMenu, setShowAvatarMenu] = useState(false);


    const currentUser = {
        id: 0,
        name: "You",
        birthDate: "01/01/2000",
        phoneNumber: "+84 123 456 789",
        avatar: "https://inkythuatso.com/uploads/thumbnails/800/2023/03/6-anh-dai-dien-trang-inkythuatso-03-15-26-36.jpg",
    };


    const toggleAvatarMenu = (e) => {
        e.stopPropagation();
        setShowAvatarMenu(prev => !prev);
    };

    return (
        <div className="w-16 h-screen bg-indigo-600 flex flex-col items-center py-4">
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
                            <li className="p-2 hover:bg-gray-100 cursor-pointer" onClick={handleProfileClick}>
                                Hồ sơ của bạn
                            </li>
                            <li className="p-2 hover:bg-gray-100 cursor-pointer">Cài đặt</li>
                            <li className="p-2 hover:bg-gray-100 cursor-pointer text-red-500"> <Link to="/login">Đăng xuất</Link></li>
                        </ul>
                    </div>
                )}
            </div>
            {/* Icon Tin nhắn */}
            <button title="Tin nhắn" className="text-white hover:bg-indigo-500 p-3 rounded-lg mb-2">
                <BsChatDotsFill size={24} />
            </button>

            {/* Icon Danh bạ */}
            <button title="Danh bạ" className="text-white hover:bg-indigo-500 p-3 rounded-lg mb-2">
                <BsPeopleFill size={24} />
            </button>

            {/* Đường kẻ ngang */}
            <div className="w-10 h-px bg-white my-4"></div>

            {/* Icon Lưu trữ */}
            <button title="Lưu trữ" className="text-white hover:bg-indigo-500 p-3 rounded-lg mb-2">
                <BsArchiveFill size={24} />
            </button>

            {/* Icon Công việc */}
            <button title="Công việc" className="text-white hover:bg-indigo-500 p-3 rounded-lg mb-2">
                <BsListTask size={24} />
            </button>

            {/* Icon Cài đặt */}
            <button title="Cài đặt" className="text-white hover:bg-indigo-500 p-3 rounded-lg">
                <BsGearFill size={24} />
            </button>

        </div>
    );
};

export default SidebarIcons;
import React, { useEffect, useState, useRef } from "react";
import { MdCloudUpload } from "react-icons/md";
import { FaArrowLeft } from 'react-icons/fa';
import axios from "axios";
const ProfilePage = ({ closeProfile }) => {
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        phone: "",
    });
    const [error, setError] = useState("");
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Lấy email từ localStorage
                const email = localStorage.getItem("user_email");

                if (!email) {
                    setError("Email không được tìm thấy trong localStorage.");
                    return;
                }

                // Gửi email lên API Laravel
                const response = await axios.post("http://localhost:8000/api/user/profile", {
                    email: email,
                });
                const data = response.data;

                // Cập nhật state với dữ liệu từ API
                setProfileData({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                });
                setError(""); // Xóa lỗi nếu có
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu từ API:", err);
                setError("Không tìm thấy thông tin người dùng."); // Hiển thị lỗi
            }
        };

        fetchProfile(); // Gọi API khi component được mount
    }, []);


    const [profileImage, setProfileImage] = useState("https://inkythuatso.com/uploads/thumbnails/800/2023/03/6-anh-dai-dien-trang-inkythuatso-03-15-26-36.jpg");
    const fileInputRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false); // Track editing state

    const handleInputChange = (field, value) => {
        setProfileData((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => setProfileImage(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setProfileImage(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        setIsEditing(false); // Exit editing mode and save the changes
    };

    const handleCancelClick = () => {
        setIsEditing(false); // Exit editing mode without saving changes
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-4">
                        {!isEditing && (
                            <button
                                onClick={closeProfile}
                                className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <FaArrowLeft className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                        <div
                            className="relative group"
                            onDrop={handleImageDrop}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <div className="w-48 h-48 rounded-full overflow-hidden ring-8 ring-offset-4 ring-blue-500 shadow-lg">
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = "https://inkythuatso.com/uploads/thumbnails/800/2023/03/6-anh-dai-dien-trang-inkythuatso-03-15-26-36.jpg";
                                    }}
                                />
                            </div>
                            <div
                                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <MdCloudUpload className="text-white text-3xl" />
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                                aria-label="Upload profile picture"
                            />
                        </div>

                        <div className="flex-1 space-y-6">
                            {!isEditing ? (
                                // Display the text fields with an Edit button
                                <>
                                    <div className="flex justify-between">
                                        <div>
                                            <div className="text-lg font-medium text-gray-900">{profileData.name}</div>
                                            <div className="text-sm text-gray-500">{profileData.email}</div>
                                            <div className="text-sm text-gray-500">{profileData.phone}</div>
                                        </div>
                                        <button
                                            onClick={handleEditClick}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </>
                            ) : (
                                // Show editable fields with Save and Cancel buttons
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <input
                                                type="text"
                                                value={profileData.name}
                                                onChange={(e) => handleInputChange("name", e.target.value)}
                                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 pr-12 sm:text-sm border-gray-300 rounded-md"
                                                aria-label="Full name"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <input
                                                    type="email"
                                                    value={profileData.email}
                                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                                    aria-label="Email address"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <input
                                                    type="tel"
                                                    value={profileData.phone}
                                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                                    aria-label="Phone number"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-5 space-x-4 flex justify-end">
                                        <button
                                            onClick={handleSaveClick}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={handleCancelClick}
                                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
import React, { useEffect, useState, useRef } from "react";
import { MdCloudUpload } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { changepassuser } from "./userapi.js"
const ProfilePage = ({ closeProfile }) => {
    const [profileData, setProfileData] = useState({
        email: "",
        username: "",
        phone: "",
        avatar: "",
    });
    const [error, setError] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const fileInputRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const handleChangePasswordClick = () => setIsChangingPassword(true);




    const handleSavePasswordClick = async (e) => {
        e.preventDefault();

        // Kiểm tra mật khẩu mới và xác nhận mật khẩu
        if (newPassword !== confirmPassword) {
            setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            setMessage("");
            return;
        }

        try {
            // Gọi API bằng Axios
            const response = await changepassuser(localStorage.getItem('user_email'), currentPassword, newPassword);
            alert("Đổi mật khẩu thành công");
            setError("");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setIsChangingPassword(false);
            alert("thanh cong");
        } catch (err) {
            console.log(err);
            alert("Sai roi");

        }
    };
    // Fetch profile data from API
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const email = localStorage.getItem("user_email");

                if (!email) {
                    setError("Email không được tìm thấy trong localStorage.");
                    return;
                }

                const response = await axios.post("http://localhost:8000/api/user/profile", {
                    email: email,
                });

                const data = response.data;
                console.log(data);
                setProfileData({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    avatar: data.avatar, // URL or base64
                });
                setError("");
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu từ API:", err);
                setError("Không tìm thấy thông tin người dùng.");
            }
        };

        fetchProfile();
    }, []);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    // Handle editing inputs
    const handleInputChange = (field, value) => {
        setProfileData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Handle avatar upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileData((prev) => ({
                    ...prev,
                    avatar: e.target.result, // Update avatar as base64
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {

            // Call API to save updated profile data
            const response = await axios.post("http://localhost:8000/api/user/update", profileData);
            console.log(response);
            setIsEditing(false);
        } catch (err) {
            console.error("Lỗi khi lưu thông tin người dùng:", err);
            setError("Không thể cập nhật thông tin.");
        }
    };

    const handleCancelClick = () => {
        setIsChangingPassword(false);
        setIsEditing(false);
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
                            onDrop={(e) => e.preventDefault()}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <div className="w-48 h-48 rounded-full overflow-hidden ring-8 ring-offset-4 ring-blue-500 shadow-lg">
                                <img
                                    src={`/${profileData.avatar}`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = "https://example.com/default-avatar.jpg";
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
                            {!isEditing && !isChangingPassword ? (
                                <>
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
                                    <button
                                        onClick={handleChangePasswordClick}
                                        className="ml-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                    >
                                        Change Password
                                    </button>
                                </>
                            ) : isChangingPassword ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Mật khẩu hiện tại</label>
                                        <input

                                            className="mt-1 p-2 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md border border-gray-300"
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}

                                            className="mt-1 p-2 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md border border-gray-300"

                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nhập lại mật khẩu mới</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="mt-1 p-2 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md border border-gray-300"

                                        />
                                    </div>
                                    <div className="pt-5 space-x-4 flex justify-end">
                                        <button
                                            onClick={handleSavePasswordClick}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md shadow-sm text-sm font-medium "
                                        >
                                            Save Password
                                        </button>
                                        <button
                                            onClick={handleCancelClick}
                                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md shadow-sm text-sm font-medium"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => handleInputChange("name", e.target.value)}
                                            className="mt-1 p-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 pr-12 sm:text-sm border-gray-300 rounded-md border border-gray-300"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                            className=" mt-1 p-2 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md border border-gray-300"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) => handleInputChange("phone", e.target.value)}
                                            className=" mt-1 p-2 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md border border-gray-300"
                                        />
                                    </div>

                                    <div className="pt-5 space-x-4 flex justify-end">
                                        <button
                                            onClick={handleSaveClick}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md shadow-sm text-sm font-medium"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={handleCancelClick}
                                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md shadow-sm text-sm font-medium"
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

import React, { useState } from "react";
import axios from "axios";
import { changepass } from "../api.js"

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu mới và xác nhận mật khẩu
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      setMessage("");
      return;
    }

    try {
      // Gọi API bằng Axios
      const response = await changepass(localStorage.getItem('email'), currentPassword, newPassword, confirmPassword);
      alert("Đổi mật khẩu thành công");
      setError("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      // Xử lý lỗi từ API


    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white p-8 rounded-xl shadow-2xl">
      <h2 className="text-center text-3xl font-extrabold text-gray-900">Đổi Mật Khẩu</h2>
      {message && <div className="mb-4 text-green-500">{message}</div>}
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form className="mt-8 space-y-4" onSubmit={handleChangePassword}>
        <div className="mb-4">
          <label className="block text-purple-700 mb-2">Mật Khẩu Hiện Tại</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-purple-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-purple-700  mb-2">Mật Khẩu Mới</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-purple-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-purple-700  mb-2">Xác Nhận Mật Khẩu Mới</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-purple-300"
          />
        </div>
        <button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          Đổi Mật Khẩu
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;

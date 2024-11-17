import React, { useState } from "react";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChangePassword = (e) => {
    e.preventDefault();
    // Kiểm tra mật khẩu mới và xác nhận mật khẩu
    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }
    // Gọi API để thay đổi mật khẩu
    // Giả sử thành công
    setMessage("Đổi mật khẩu thành công.");
    // Reset các trường
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">Đổi Mật Khẩu</h2>
      {message && <div className="mb-4 text-green-500">{message}</div>}
      <form onSubmit={handleChangePassword}>
        <div className="mb-4">
          <label className="block text-purple-700">Mật Khẩu Hiện Tại</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-purple-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-purple-700">Mật Khẩu Mới</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-purple-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-purple-700">Xác Nhận Mật Khẩu Mới</label>
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
          className="w-full py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Đổi Mật Khẩu
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;

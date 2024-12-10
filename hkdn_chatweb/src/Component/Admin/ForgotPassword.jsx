import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = (e) => {
    e.preventDefault();
    // Gọi API gửi email reset mật khẩu
    // Giả sử thành công
    setMessage("Mật khẩu mới đã được gửi về email của bạn.");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-purple-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">
          Quên Mật Khẩu
        </h2>
        {message ? (
          <div className="mb-4 text-green-500">{message}</div>
        ) : (
          <form onSubmit={handleForgotPassword}>
            <div className="mb-4">
              <label className="block text-purple-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-purple-300"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Gửi Mật Khẩu Mới
            </button>
          </form>
        )}
        <div className="mt-4 text-center">
          <Link to="/admin/login" className="text-purple-600 hover:underline">
            Quay lại Đăng Nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

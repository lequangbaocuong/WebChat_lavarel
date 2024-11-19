import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Xử lý đăng nhập ở đây (gọi API)
    // Giả sử password mặc định là 'admin123'
    if (password === "admin123") {
      // Mã hóa mật khẩu và lưu token vào localStorage (ví dụ)
      localStorage.setItem("adminToken", "someEncryptedToken");
      navigate("/admin");
    } else {
      setError("Mật khẩu không đúng!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-purple-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">
          Admin Login
        </h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-purple-700">Mật Khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-purple-300"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Đăng Nhập
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link
            to="/admin/forgot-password"
            className="text-purple-600 hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

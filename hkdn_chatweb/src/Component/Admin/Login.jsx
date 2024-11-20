import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api.js"
const Login = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login('Vantienhuynh2105@gmail.com', password);
      if (response?.success) {
        localStorage.setItem('adminToken', response.access_token);
        localStorage.setItem('email', response.email);
        localStorage.setItem('user_id', response.id);
        navigate('/admin');
      } else {
        setError('Đăng nhập không thành công!');
      }
    } catch (error) {
      console.error(error);
      alert('Login failed!');
    }

  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl transform transition-all hover:scale-[1.01]">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Admin Login
        </h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-purple-700 mb-2">Mật Khẩu</label>
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
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Đăng Nhập
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link
            to="/forget"
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

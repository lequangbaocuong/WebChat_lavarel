import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './styles/tailwind.css';
import { Link } from 'react-router-dom';
import { handleEmailChange, handlePasswordChange, selectDomain } from './utils/validators';
import { BiLoaderAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", passwordMatch: "" });
  const [loading, setLoading] = useState(false);

  const commonDomains = ["@gmail.com", "@yahoo.com", "@outlook.com", "@hotmail.com"];
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleShowPassword = () => setShowPassword(!showPassword);

  // Email validation function
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };


  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setErrors((prev) => ({
      ...prev,
      passwordMatch: value !== password ? "Mật khẩu không khớp" : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    if (!validateEmail(email)) {
      setErrors((prev) => ({ ...prev, email: "Email không hợp lệ." }));
      return;
    }

    // Check if there are any validation errors
    if (!errors.email && !errors.password && !errors.passwordMatch && email && password && confirmPassword) {
      setLoading(true);
      try {

        // Gửi yêu cầu đăng ký đến API Laravel
        const response = await axios.post("http://localhost:8000/api/register", {
          username,
          email,
          password,
        });

        // Xử lý phản hồi từ API
        if (response.data.success) {
          console.log("Đăng ký thành công:", response.data);
          // Chuyển hướng người dùng hoặc lưu token...
          // Ví dụ:
          navigate(response.data.redirect);
        } else {
          console.log("Đăng ký thất bại:", response.data.message);
          setErrors({ ...errors, form: response.data.message });
        }
      } catch (error) {
        console.error("Lỗi khi đăng ký:", error);
        setErrors({ ...errors, form: "Đăng ký không thành công. Vui lòng thử lại." });
      } finally {
        setLoading(false);
      }
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Vui lòng đăng ký
        </h2>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4" method='POST'>
          <div>
            <input
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200`}
              placeholder="Email address"
              value={email}
              onChange={(e) => handleEmailChange(e, setEmail, setShowSuggestions, setErrors)}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby="email-error"
            />
            {showSuggestions && (
              <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg">
                {commonDomains.map((domain) => (
                  <button
                    key={domain}
                    type="button"
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    onClick={() => selectDomain(email, domain, setEmail, setShowSuggestions, setErrors)}
                  >
                    {email.split("@")[0] + domain}
                  </button>
                ))}
              </div>
            )}
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200`}
              placeholder="Password"
              value={password}
              onChange={(e) => handlePasswordChange(e, setPassword, setErrors)}
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby="password-error"
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password}</p>
            )}
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              onClick={handleShowPassword}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
            {errors.passwordMatch && (
              <p className="mt-2 text-sm text-red-600">{errors.passwordMatch}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              required
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
              Tôi chấp nhận{" "}
              <a href="/terms" className="text-indigo-600 hover:text-indigo-500">
                Điều khoản và Điều Kiện
              </a>
            </label>
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            disabled={errors.email || errors.password || errors.passwordMatch}
          >
            {loading ? (
              <BiLoaderAlt className="animate-spin h-5 w-5" />
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Bạn đã có tài khoản?{" "}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;

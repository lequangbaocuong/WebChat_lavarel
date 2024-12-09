import React, { useState } from "react";
import { useEffect } from 'react';
import { FaEye, FaEyeSlash, FaGoogle, FaGithub, FaMicrosoft } from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import './styles/tailwind.css';
import { handleEmailChange, handlePasswordChange, selectDomain } from './utils/validators';
import NotificationPopup from './Component/NotificationPopup'
const LogoUrl = "/HKDN.png";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showNotification, setShowNotification] = useState(false);
  const commonDomains = ["@gmail.com", "@yahoo.com", "@outlook.com", "@hotmail.com"];

  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();


  const [loginUrl, setLoginUrl] = useState(null);


  const handleSubmit = async (e) => {
    localStorage.setItem('email', email);
    e.preventDefault();
    if (!errors.email && !errors.password && email && password) {
      setLoading(true);
      try {
        // Send a login request to the Laravel API
        const response = await axios.post("http://localhost:8000/api/login", {
          email,
          password,
        });
        if (response.data.success) {
          setShowNotification(true);
          setTimeout(() => {
            localStorage.setItem('user_email', response.data.email);
            localStorage.setItem('auth_token', response.data.access_token);
            localStorage.setItem("user_id", response.data.id); // Store the current user's ID on login
            localStorage.setItem('message', response.data.message);
            localStorage.setItem('username', response.data.username);

            navigate('/home');
          }, 3000);
        }
      } catch (error) {
        if (error.response?.status === 403) {



          setErrors({
            ...errors,
            form: (
              <>
                Email chưa xác thực&nbsp;<Link
                  to="/OTP"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Xác thực ngay ?
                </Link>
              </>
            ),
          });
        } else if (error.response?.status === 401) {
          // Email hoặc mật khẩu sai
          setErrors({ ...errors, form: "Email hoặc mật khẩu không đúng." });
        } else {
          // Lỗi khác
          setErrors({ ...errors, form: "Đăng nhập thất bại. Vui lòng thử lại." });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl transform transition-all hover:scale-[1.01]">
        <div className="flex flex-col justify-center items-center">
          <img className="" src={LogoUrl} alt="Logo" />

        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md -space-y-px">
            {/* Email Input */}
            <div className="relative mb-4">
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
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
                <p className="mt-2 text-sm text-red-600" id="email-error">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative mb-4">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="Password"
                value={password}
                onChange={(e) => handlePasswordChange(e, setPassword, setErrors)}
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby="password-error"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
              </button>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600" id="password-error">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/forget" className="font-medium text-indigo-600 hover:text-indigo-500">
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            {errors.form && (
              <div className="text-red-600 text-sm mb-2">
                {errors.form}
              </div>
            )}
            <button
              type="submit"
              disabled={loading || errors.email || errors.password}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? <BiLoaderAlt className="animate-spin h-5 w-5" /> : "Đăng nhập"}
            </button>
          </div>

          {/* Alternative Sign-In Options */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => window.location.href = loginUrl} // Wrap in a function
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                disabled={!loginUrl} // Optionally disable button until `loginUrl` is set
              >
                <FaGoogle className="h-5 w-5 text-red-500" />
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <FaGithub className="h-5 w-5 text-gray-900" />
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <FaMicrosoft className="h-5 w-5 text-blue-500" />
              </button>
            </div>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Không có tài khoản?{" "}
          <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            Đăng ký ngay
          </Link>
        </p>
      </div>
      {showNotification && (<NotificationPopup message={localStorage.getItem('message')} />)}
    </div>
  );
};

export default LoginPage;

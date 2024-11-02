import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './styles/tailwind.css';
import { Link } from 'react-router-dom';

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", passwordMatch: "" });

  const handleShowPassword = () => setShowPassword(!showPassword);

  // Email validation function
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrors((prev) => ({
      ...prev,
      email: validateEmail(value) ? "" : "Email không đúng định dạng",
    }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    // Check if password is greater than 8 characters
    if (value.length < 8) {
      setErrors((prev) => ({ ...prev, password: "Mật khẩu phải lớn hơn 8 ký tự", passwordMatch: "" }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" })); // Clear password error if valid length

      // Reset password match error if confirmPassword is empty
      if (confirmPassword && value !== confirmPassword) {
        setErrors((prev) => ({ ...prev, passwordMatch: "Mật khẩu không khớp" }));
      } else {
        setErrors((prev) => ({ ...prev, passwordMatch: "" })); // Clear password match error if valid
      }
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setErrors((prev) => ({
      ...prev,
      passwordMatch: value !== password ? "Mật khẩu không khớp" : "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if there are any validation errors
    if (!errors.email && !errors.password && !errors.passwordMatch && email && password && confirmPassword) {
      // Proceed with signup logic here
      console.log("Đăng ký thành công");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Vui lòng đăng ký
        </h2>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
              type="email"
              placeholder="Email address"
              value={email}
              onChange={handleEmailChange}
              className={`appearance-none rounded-lg block w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              required
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              className={`appearance-none rounded-lg block w-full px-3 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              required
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
            Đăng ký
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

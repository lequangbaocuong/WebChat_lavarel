import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaGoogle, FaGithub, FaMicrosoft } from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";
import './styles/tailwind.css';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const commonDomains = ["@gmail.com", "@yahoo.com", "@outlook.com", "@hotmail.com"];
  const [showSuggestions, setShowSuggestions] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setShowSuggestions(!value.includes("@") && value.length > 0);
    setErrors(prev => ({
      ...prev,
      email: validateEmail(value) ? "" : "Invalid email format"
    }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setErrors(prev => ({
      ...prev,
      password: value.length >= 8 ? "" : "Password must be at least 8 characters"
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!errors.email && !errors.password && email && password) {
      setLoading(true);
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoading(false);
    }
  };

  const selectDomain = (domain) => {
    setEmail(email.split("@")[0] + domain);
    setShowSuggestions(false);
    setErrors(prev => ({ ...prev, email: "" }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl transform transition-all hover:scale-[1.01]">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in to continue
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md -space-y-px">
            <div className="relative mb-4">
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200`}
                placeholder="Email address"
                value={email}
                onChange={handleEmailChange}
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
                      onClick={() => selectDomain(domain)}
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

            <div className="relative mb-4">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200`}
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
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
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || errors.email || errors.password}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <BiLoaderAlt className="animate-spin h-5 w-5" />
              ) : (
                "Sign in"
              )}
            </button>
          </div>

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
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all duration-200"
              >
                <FaGoogle className="h-5 w-5 text-red-500" />
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all duration-200"
              >
                <FaGithub className="h-5 w-5 text-gray-900" />
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all duration-200"
              >
                <FaMicrosoft className="h-5 w-5 text-blue-500" />
              </button>
            </div>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
            Sign up now
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
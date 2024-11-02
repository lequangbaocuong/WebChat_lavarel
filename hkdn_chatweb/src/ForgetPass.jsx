import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";
import './styles/tailwind.css';
import { Link } from 'react-router-dom';
import { handleEmailChange, selectDomain } from './utils/validators';
import ReCAPTCHA from "react-google-recaptcha";

const ForgetPass = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ email: "", password: "" });
    const [captchaToken, setCaptchaToken] = useState(null);

    const commonDomains = ["@gmail.com", "@yahoo.com", "@outlook.com", "@hotmail.com"];
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!errors.email && captchaToken) {
            setLoading(true);
            // Simulating API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            setLoading(false);
            // Handle your form submission logic here
        } else {
            // Handle case when captcha is not verified
            alert("Please complete the CAPTCHA verification.");
        }
    };

    const onCaptchaChange = (token) => {
        setCaptchaToken(token);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl transform transition-all hover:scale-[1.01]">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Quên Mật Khẩu
                    </h2>
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
                    </div>

                    {/* Thêm reCAPTCHA */}
                    <div className="mb-4">
                        <ReCAPTCHA
                            sitekey="6LcRRnMqAAAAAC2CFVSZ4YPwfrWDy3Fpqv5n1zTh"
                            onChange={onCaptchaChange}
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={loading || errors.email || !captchaToken}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {loading ? (
                                <BiLoaderAlt className="animate-spin h-5 w-5" />
                            ) : (
                                "Xác nhận"
                            )}
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-center text-sm text-gray-600">
                    Bạn không có tài khoản?{" "}
                    <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Đăng ký ngay
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgetPass;

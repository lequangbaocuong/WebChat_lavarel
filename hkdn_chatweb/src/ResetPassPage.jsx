import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './styles/tailwind.css';
import { Link } from 'react-router-dom';
import { handleEmailChange, handlePasswordChange, selectDomain } from './utils/validators';
import { BiLoaderAlt } from "react-icons/bi";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import RegistrationSuccess from './Component/RegistrationSuccess';



const ResetPassPage = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ email: "", password: "", passwordMatch: "" });
    const [loading, setLoading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [searchParams] = useSearchParams();

    const handleShowPassword = () => setShowPassword(!showPassword);

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        setErrors((prev) => ({
            ...prev,
            passwordMatch: value !== password ? "Mật khẩu không khớp" : "",
        }));
    };
    const Message = {
        ULR: "login",
        ULR2: "",
        mes1: "Đổi mật khẩu thành công",
        mes2: "Vui lòng đăng nhập để tiếp tục",
        btleft: "Trở lại",
        btright: "Đăng nhập ngay"
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = searchParams.get('token');
        const email = searchParams.get('email');
        console.log(token);
        console.log(email);

        if (!errors.password && !errors.passwordMatch && password && confirmPassword) {
            setLoading(true);
            try {
                const response = await axios.post("http://localhost:8000/api/reset-password", {
                    token: token,
                    email: email,
                    password: password,
                    password_confirmation: confirmPassword
                });

                setShowSuccessMessage(true);
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
            {showSuccessMessage ? (
                <RegistrationSuccess {...Message} />
            ) : (
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl">
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Cập nhật mật khẩu
                    </h2>
                    <form onSubmit={handleSubmit} className="mt-8 space-y-4" method='POST'>
                        <div className="relative">
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
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                                    onClick={handleShowPassword}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                            )}
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

                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                            disabled={errors.email || errors.password || errors.passwordMatch}
                        >
                            {loading ? (
                                <BiLoaderAlt className="animate-spin h-5 w-5" />
                            ) : (
                                "Xác nhận"
                            )}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default ResetPassPage;
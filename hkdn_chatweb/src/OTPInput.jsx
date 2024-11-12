import React, { useState, useRef, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import RegistrationSuccess from "./Component/RegistrationSuccess";

const OTPInput = () => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const inputRefs = useRef([]);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const Message = {
        ULR: "login",
        ULR2: "",
        mes1: "Đăng ký thành công",
        mes2: "Vui lòng đăng nhập để tiếp tục",
        btleft: "Trở lại",
        btright: "Đăng nhập ngay"
    };


    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (element, index) => {
        const value = element.value;
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError("");

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && index > 0 && !otp[index]) {
            const newOtp = [...otp];
            newOtp[index - 1] = "";
            setOtp(newOtp);
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(pasteData)) {
            setError("Please paste numbers only");
            return;
        }

        const newOtp = [...otp];
        pasteData.split("").forEach((digit, index) => {
            if (index < 6) newOtp[index] = digit;
        });
        setOtp(newOtp);
    };

    const validateOTP = async (otpString) => {
        const email = localStorage.getItem("email");
        if (!email) {
            setError("Email không tìm thấy trong bộ nhớ local.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8000/api/verifyOtp", {
                email: email,
                otp: otpString,
            });

            if (response.data.success) {
                setShowSuccessMessage(true);
                setSuccess(true);
                setError("");
            } else {
                setError("Mã OTP không hợp lệ. Vui lòng thử lại.");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Lỗi máy chủ. Vui lòng thử lại sau.");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (otp.some((digit) => digit === "")) {
            setError("Vui lòng nhập đủ 6 chữ số");
            return;
        }
        validateOTP(otp.join(""));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
            {showSuccessMessage ? (
                <RegistrationSuccess {...Message} />
            ) : (
                <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 hover:shadow-3xl">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Nhập mã OTP</h2>
                    <p className="text-gray-600 text-center mb-8">Hãy kiểm tra email để nhận mã OTP từ chúng tôi</p>

                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-wrap justify-center gap-2 mb-6">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleChange(e.target, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onPaste={handlePaste}
                                    ref={(ref) => (inputRefs.current[index] = ref)}
                                    className={`w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg
                  ${error ? "border-red-500" : "border-gray-300"}
                  focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200
                  transition-all duration-200 sm:w-14 sm:h-14
                  ${success ? "border-green-500 bg-green-50" : ""}`}
                                    aria-label={`OTP digit ${index + 1}`}
                                />
                            ))}
                        </div>

                        {error && (
                            <p className="text-red-500 text-center mb-4 animate-shake">{error}</p>
                        )}

                        {success && (
                            <div className="flex items-center justify-center text-green-500 mb-4">
                                <FaCheckCircle className="mr-2" />
                                <span>OTP chính xác!</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`w-full py-3 rounded-lg text-white font-semibold
        ${success ? "bg-green-500 hover:bg-green-600" : error ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}
        transition-colors duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2
        ${success ? "focus:ring-green-500" : error ? "focus:ring-red-500" : "focus:ring-blue-500"}`}
                        >
                            {success ? "Thành công" : error ? "Thất bại" : "Xác thực OTP"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button className="text-blue-500 hover:text-blue-600 font-medium focus:outline-none">
                            Gửi lại
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OTPInput;

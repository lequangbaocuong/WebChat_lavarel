

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// Hàm xử lý thay đổi email
export const handleEmailChange = (e, setEmail, setShowSuggestions, setErrors) => {
    const value = String(e.target.value || "");
    setEmail(value);
    setShowSuggestions(!value.includes("@") && value.length > 0);
    setErrors(prev => ({
        ...prev,
        email: validateEmail(value) ? "" : "Email không đúng định dạng"
    }));
};


// Hàm xử lý thay đổi mật khẩu
export const handlePasswordChange = (e, setPassword, setErrors) => {
    const value = e.target.value;
    setPassword(value);
    setErrors(prev => ({
        ...prev,
        password: value.length >= 8 ? "" : "Mật khẩu phải lớn hơn 8 ký tự",
    }));
};
// Hàm kiểm tra domain
export const selectDomain = (email, domain, setEmail, setShowSuggestions, setErrors) => {
    setEmail(email.split("@")[0] + domain);
    setShowSuggestions(false);
    setErrors(prev => ({ ...prev, email: "" }));
};
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import ForgetPass from './ForgetPass';
import Navbar from './Component/Navbar';
import ChatUI from './Component/ChatUI';
import ChatPage from './ChatPage';

import HomePage from './HomePage';

import ResetPassPage from './ResetPassPage'
import VideoCallPage from './VideoCallPage'
import OTPInput from './OTPInput';
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/forget" element={<ForgetPass />} />
                <Route path="/reset-password" element={<ResetPassPage />} />
                <Route path="/test" element={<Navbar />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/videocall" element={<VideoCallPage />} />
                <Route path="/OTP" element={<OTPInput />} />
            </Routes>
        </Router>
    );
};

export default App;

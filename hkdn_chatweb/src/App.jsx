import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import ForgetPass from './ForgetPass';
import Navbar from './Component/Navbar';
import ChatUI from './Component/ChatUI';
import ChatPage from './ChatPage';
import ResetPassPage from './ResetPassPage';
import VideoCallPage from './VideoCallPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/homepage" element={<HomePage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/forget" element={<ForgetPass />} />
                <Route path="/reset-password" element={<ResetPassPage />} />
                <Route path="/test" element={<Navbar />} />
                <Route path="/home" element={<ChatPage />} />
                <Route path="/videocall" element={<VideoCallPage />} />
            </Routes>
        </Router>
    );
};

export default App;

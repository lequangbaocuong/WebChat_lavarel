import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import ForgetPass from './ForgetPass';
import Navbar from './Component/Navbar';
import ChatUI from './Component/ChatUI';
import ChatPage from './ChatPage';
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/forget" element={<ForgetPass />} />
                <Route path="/test" element={<Navbar />} />
                <Route path="/home" element={<ChatPage />} />
            </Routes>
        </Router>
    );
};

export default App;

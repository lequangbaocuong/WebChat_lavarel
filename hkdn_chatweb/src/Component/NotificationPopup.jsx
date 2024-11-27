import React, { useState, useEffect } from "react";
import { FiCheckCircle, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const NotificationPopup = ({ message, duration = 5000 }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (message) {
            setIsVisible(true);
            setProgress(100); // Reset progress bar
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, duration);

            const progressTimer = setInterval(() => {
                setProgress((prev) => Math.max(prev - (100 / (duration / 100)), 0));
            }, 100);

            return () => {
                clearTimeout(timer);
                clearInterval(progressTimer);
            };
        }
    }, [message, duration]);

    const handleClose = () => {
        setIsVisible(false);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            setIsVisible(false);
        }
    };

    return (
        <AnimatePresence>
            {isVisible && message && (
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed left-4 bottom-4 z-50 w-full max-w-sm"
                    role="alert"
                    aria-live="polite"
                    tabIndex={0}
                    onKeyDown={handleKeyDown}
                >
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border-l-4 border-green-500 transform transition-all hover:scale-102">
                        <div className="p-4 flex items-center">
                            <div className="flex-shrink-0">
                                <FiCheckCircle className="h-6 w-6 text-green-500" />
                            </div>
                            <div className="ml-3 w-0 flex-1">
                                <p className="text-sm font-medium text-gray-800">{message}</p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="flex-shrink-0 flex p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                                aria-label="Close notification"
                            >
                                <FiX className="h-5 w-5 text-gray-400" />
                            </button>
                        </div>
                        <motion.div
                            className="bg-green-500 h-1 w-full"
                            style={{
                                scaleX: progress / 100,
                            }}
                            initial={{ scaleX: 1 }}
                            animate={{ scaleX: progress / 100 }}
                            transition={{ duration: 0.1 }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NotificationPopup;

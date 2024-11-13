import React, { useState, useEffect } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { FaComments, FaUserFriends, FaLock, FaSmile } from "react-icons/fa";

const IntroductionPage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 1,
            title: "Hello, Cuong!",
            description: "Welcome to webchat",
            image: "images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3",
        },
        {
            id: 2,
            title: "Real-Time Messaging",
            description: "Experience seamless communication with instant message delivery",
            image: "images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3",
        },
        {
            id: 3,
            title: "Secure & Private",
            description: "Your conversations are protected with end-to-end encryption",
            image: "images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-4.0.3",
        },
    ];

    const features = [
        {
            icon: <FaComments className="w-8 h-8" />,
            title: "Instant Messaging",
            description: "Send and receive messages in real-time",
        },
        {
            icon: <FaUserFriends className="w-8 h-8" />,
            title: "Group Chats",
            description: "Create and manage group conversations",
        },
        {
            icon: <FaLock className="w-8 h-8" />,
            title: "Secure Communication",
            description: "End-to-end encryption for your privacy",
        },
        {
            icon: <FaSmile className="w-8 h-8" />,
            title: "Rich Media Sharing",
            description: "Share photos, videos, and emojis",
        },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="relative flex-1 overflow-hidden">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute w-full h-full transition-transform duration-500 ease-in-out transform ${index === currentSlide ? "translate-x-0" : "translate-x-full"
                            }`}
                    >
                        <div className="relative w-full h-full">
                            <img
                                src={`https://${slide.image}`}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3";
                                }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <div className="text-center text-white px-4">
                                    <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
                                    <p className="text-xl">{slide.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-all"
                    aria-label="Previous slide"
                >
                    <BsChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-all"
                    aria-label="Next slide"
                >
                    <BsChevronRight className="w-6 h-6" />
                </button>

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? "bg-white" : "bg-white bg-opacity-50"}`}
                            onClick={() => setCurrentSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Why Choose WebChat?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="text-blue-600 mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default IntroductionPage;
import { useState, useEffect } from "react";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const RegistrationSuccess = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isVisible]);

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsAnimating(false);
    }, 300);
  };

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("overlay")) {
      handleClose();
    }
  };

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overlay bg-gradient-to-br bg-opacity-50 ${isAnimating ? "animate-fade-out" : "animate-fade-in"
        }`}
      onClick={handleOutsideClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="notification-title"
    >
      <div
        className={`bg-white rounded-md p-8 max-w-md w-11/12 md:w-full relative shadow-2xl ${isAnimating ? "animate-slide-out" : "animate-slide-in"
          }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close notification"
        >
          <FaTimes className="text-xl" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="bg-green-100 p-3 rounded-full mb-4">
            <FaCheckCircle className="text-4xl text-green-500" />
          </div>

          <h2
            id="notification-title"
            className="text-2xl font-bold text-gray-800 mb-2"
          >
            Đăng ký thành công
          </h2>

          <p className="text-gray-600 mb-6">
            Hãy đăng nhập để tiếp tục sử dụng
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button
              onClick={handleClose}
              className="w-full sm:w-1/2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Đăng ký lại
            </button>
            <button
              onClick={handleNavigateToLogin}
              className="w-full sm:w-1/2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              autoFocus
            >
              Trở về đăng nhập
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes slideOut {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(20px); opacity: 0; }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-fade-out {
          animation: fadeOut 0.3s ease-out;
        }

        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }

        .animate-slide-out {
          animation: slideOut 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default RegistrationSuccess;

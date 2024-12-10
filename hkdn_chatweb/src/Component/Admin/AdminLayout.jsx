import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaUserCog, FaDoorClosed, FaKey, FaSignOutAlt } from "react-icons/fa";


const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xử lý đăng xuất (xóa token, redirect tới trang login, v.v.)
    // Ví dụ:
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b bg-purple-500 to-purple-600 text-white flex flex-col shadow-lg">
        <div className="p-6 text-center">
          <img className="mx-auto mb-4 w-24" src="/HKDN.png" alt="Logo" />
          <h2 className="text-2xl font-extrabold uppercase tracking-normal">Quản Lý</h2>
        </div>

        <nav className="flex-1">
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center py-3 px-5 transition-all duration-200 ${isActive ? "bg-indigo-600" : "hover:bg-indigo-700"
              }`
            }
          >
            <FaTachometerAlt className="mr-3" /> Dashboard
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center py-3 px-5 transition-all duration-200 ${isActive ? "bg-indigo-600" : "hover:bg-indigo-700"
              }`
            }
          >
            <FaUserCog className="mr-3" /> Quản Lý Người Dùng
          </NavLink>
          <NavLink
            to="/admin/rooms"
            className={({ isActive }) =>
              `flex items-center py-3 px-5 transition-all duration-200 ${isActive ? "bg-indigo-600" : "hover:bg-indigo-700"
              }`
            }
          >
            <FaDoorClosed className="mr-3" /> Quản Lý Phòng
          </NavLink>
          <NavLink
            to="/admin/changepass"
            className={({ isActive }) =>
              `flex items-center py-3 px-5 transition-all duration-200 ${isActive ? "bg-indigo-600" : "hover:bg-indigo-700"
              }`
            }
          >
            <FaKey className="mr-3" /> Đổi Mật Khẩu
          </NavLink>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center w-full py-3 px-5 text-left hover:bg-red-600 transition-all duration-200"
        >
          <FaSignOutAlt className="mr-3" /> Đăng Xuất
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;

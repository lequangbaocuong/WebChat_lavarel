import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";

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
      <div className="w-64  bg-indigo-600 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold"><img className="mx-auto" src="/HKDN.png" /></div>
        <div className="p-4 text-2xl font-bold mx-auto">Quản Lý</div>

        <nav className="flex-1">
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive
                ? "block py-2.5 px-4 bg-indigo-600"
                : "block py-2.5 px-4 hover:bg-indigo-600"
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              isActive
                ? "block py-2.5 px-4 bg-purple-600"
                : "block py-2.5 px-4 hover:bg-purple-600"
            }
          >
            Quản Lý Người Dùng
          </NavLink>
          <NavLink
            to="/admin/rooms"
            className={({ isActive }) =>
              isActive
                ? "block py-2.5 px-4 bg-purple-600"
                : "block py-2.5 px-4 hover:bg-purple-600"
            }
          >
            Quản Lý Phòng
          </NavLink>
          <NavLink
            to="/admin/changepass"
            className={({ isActive }) =>
              isActive
                ? "block py-2.5 px-4 bg-purple-600"
                : "block py-2.5 px-4 hover:bg-purple-600"
            }
          >
            Đổi Mật Khẩu
          </NavLink>
        </nav>
        <button
          onClick={handleLogout}
          className="w-full text-left py-2.5 px-4 hover:bg-purple-600"
        >
          Đăng Xuất
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

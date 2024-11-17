import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Gọi API lấy danh sách người dùng
    // Giả sử dữ liệu mẫu:
    const fetchedUsers = [
      { id: 1, name: "Nguyễn Văn A", email: "a@example.com", role: "Normal" },
      { id: 2, name: "Trần Thị B", email: "b@example.com", role: "Moderate" },
      // ... các người dùng khác
    ];
    setUsers(fetchedUsers);
  }, []);

  const handleDelete = (id) => {
    // Gọi API xóa người dùng
    // Cập nhật danh sách người dùng sau khi xóa
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleResetPassword = (email) => {
    // Gọi API reset mật khẩu và gửi email
    alert(`Mật khẩu mới đã được gửi về email: ${email}`);
  };

  const handleChangeRole = (id, newRole) => {
    // Gọi API cập nhật quyền người dùng
    setUsers(
      users.map((user) => (user.id === id ? { ...user, role: newRole } : user))
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-purple-700">
          Danh Sách Người Dùng
        </h1>
        <Link
          to="/admin/users/add"
          className="py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Thêm Người Dùng
        </Link>
      </div>
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Tên</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Quyền</th>
            <th className="py-2 px-4 border-b">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b text-center">{user.id}</td>
              <td className="py-2 px-4 border-b">{user.name}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b text-center">
                <select
                  value={user.role}
                  onChange={(e) => handleChangeRole(user.id, e.target.value)}
                  className="px-2 py-1 border rounded"
                >
                  <option value="Normal">Normal</option>
                  <option value="Moderate">Moderate</option>
                </select>
              </td>
              <td className="py-2 px-4 border-b text-center">
                <Link
                  to={`/admin/users/edit/${user.id}`}
                  className="text-blue-500 hover:underline mr-2"
                >
                  Sửa
                </Link>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-500 hover:underline mr-2"
                >
                  Xóa
                </button>
                <button
                  onClick={() => handleResetPassword(user.email)}
                  className="text-green-500 hover:underline"
                >
                  Reset Mật Khẩu
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-4">
                Không có người dùng nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;

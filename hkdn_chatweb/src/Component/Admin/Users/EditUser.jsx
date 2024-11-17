import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState({ name: "", email: "", role: "Normal" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Gọi API lấy thông tin người dùng theo ID
    // Giả sử dữ liệu mẫu:
    const fetchedUser = {
      id,
      name: "Nguyễn Văn A",
      email: "a@example.com",
      role: "Normal",
    };
    setUser(fetchedUser);
  }, [id]);

  const handleEditUser = (e) => {
    e.preventDefault();
    // Gọi API cập nhật người dùng
    // Giả sử thành công
    setMessage("Cập nhật người dùng thành công.");
    // Redirect về danh sách người dùng sau 2 giây
    setTimeout(() => {
      navigate("/admin/users");
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">
        Sửa Người Dùng
      </h2>
      {message && <div className="mb-4 text-green-500">{message}</div>}
      <form onSubmit={handleEditUser}>
        <div className="mb-4">
          <label className="block text-purple-700">Tên</label>
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-purple-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-purple-700">Email</label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-purple-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-purple-700">Quyền</label>
          <select
            value={user.role}
            onChange={(e) => setUser({ ...user, role: e.target.value })}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-purple-300"
          >
            <option value="Normal">Normal</option>
            <option value="Moderate">Moderate</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Cập Nhật Người Dùng
        </button>
      </form>
    </div>
  );
};

export default EditUser;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Normal");
  const [message, setMessage] = useState("");

  const handleAddUser = (e) => {
    e.preventDefault();
    // Gọi API thêm người dùng
    // Giả sử thành công
    setMessage("Thêm người dùng thành công.");
    // Redirect về danh sách người dùng sau 2 giây
    setTimeout(() => {
      navigate("/admin/users");
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">
        Thêm Người Dùng
      </h2>
      {message && <div className="mb-4 text-green-500">{message}</div>}
      <form onSubmit={handleAddUser}>
        <div className="mb-4">
          <label className="block text-purple-700">Tên</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-purple-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-purple-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-purple-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-purple-700">Quyền</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
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
          Thêm Người Dùng
        </button>
      </form>
    </div>
  );
};

export default AddUser;

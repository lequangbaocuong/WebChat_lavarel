import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddRoom = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleAddRoom = (e) => {
    e.preventDefault();
    // Gọi API thêm phòng chat
    // Giả sử thành công
    setMessage("Thêm phòng chat thành công.");
    // Redirect về danh sách phòng sau 2 giây
    setTimeout(() => {
      navigate("/admin/rooms");
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">
        Thêm Phòng Chat
      </h2>
      {message && <div className="mb-4 text-green-500">{message}</div>}
      <form onSubmit={handleAddRoom}>
        <div className="mb-4">
          <label className="block text-purple-700">Tên Phòng Chat</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-purple-300"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Thêm Phòng Chat
        </button>
      </form>
    </div>
  );
};

export default AddRoom;

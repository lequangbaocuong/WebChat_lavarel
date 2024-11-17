import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditRoom = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [room, setRoom] = useState({ name: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Gọi API lấy thông tin phòng theo ID
    // Giả sử dữ liệu mẫu:
    const fetchedRoom = { id, name: "Phòng 1" };
    setRoom(fetchedRoom);
  }, [id]);

  const handleEditRoom = (e) => {
    e.preventDefault();
    // Gọi API cập nhật phòng chat
    // Giả sử thành công
    setMessage("Cập nhật phòng chat thành công.");
    // Redirect về danh sách phòng sau 2 giây
    setTimeout(() => {
      navigate("/admin/rooms");
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">
        Sửa Phòng Chat
      </h2>
      {message && <div className="mb-4 text-green-500">{message}</div>}
      <form onSubmit={handleEditRoom}>
        <div className="mb-4">
          <label className="block text-purple-700">Tên Phòng Chat</label>
          <input
            type="text"
            value={room.name}
            onChange={(e) => setRoom({ ...room, name: e.target.value })}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-purple-300"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Cập Nhật Phòng Chat
        </button>
      </form>
    </div>
  );
};

export default EditRoom;

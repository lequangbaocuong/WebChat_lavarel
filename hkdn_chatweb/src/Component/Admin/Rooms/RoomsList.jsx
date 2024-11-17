import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const RoomsList = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Gọi API lấy danh sách phòng
    // Giả sử dữ liệu mẫu:
    const fetchedRooms = [
      { id: 1, name: "Phòng 1", createdAt: "2023-01-01" },
      { id: 2, name: "Phòng 2", createdAt: "2023-02-15" },
      // ... các phòng khác
    ];
    setRooms(fetchedRooms);
  }, []);

  const handleDelete = (id) => {
    // Gọi API xóa phòng
    // Cập nhật danh sách phòng sau khi xóa
    setRooms(rooms.filter((room) => room.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-purple-700">
          Danh Sách Phòng Chat
        </h1>
        <Link
          to="/admin/rooms/add"
          className="py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Thêm Phòng Chat
        </Link>
      </div>
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Tên Phòng</th>
            <th className="py-2 px-4 border-b">Ngày Tạo</th>
            <th className="py-2 px-4 border-b">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td className="py-2 px-4 border-b text-center">{room.id}</td>
              <td className="py-2 px-4 border-b">{room.name}</td>
              <td className="py-2 px-4 border-b">{room.createdAt}</td>
              <td className="py-2 px-4 border-b text-center">
                <Link
                  to={`/admin/rooms/edit/${room.id}`}
                  className="text-blue-500 hover:underline mr-2"
                >
                  Sửa
                </Link>
                <button
                  onClick={() => handleDelete(room.id)}
                  className="text-red-500 hover:underline"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
          {rooms.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-4">
                Không có phòng chat nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RoomsList;

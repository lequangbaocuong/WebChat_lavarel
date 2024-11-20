import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import { getuser, addroom, getroom, editroom, deleteroom } from "../../api.js"
import { use } from "framer-motion/client";

const ChatRoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [roomData, setRoomData] = useState({
    id: "",
    name: "",
    avatar: "images.unsplash.com/photo-1522071820081-009f0129c71c",
    creator: "",
    createdAt: "",

  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [newRoom, setNewRoom] = useState({
    name: "",
    email: localStorage.getItem("email"),
    user_id: localStorage.getItem("user_id"),
  });

  const fetchRoom = async () => {
    try {
      const response = await getroom();
      console.log(response.rooms);
      setRooms(response.rooms);
      setLoading(false);
    } catch (err) {
      setErrors("Không thể tải danh sách người dùng");
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchRoom();

  }, []);





  const filteredRooms = rooms.filter(rooms =>
    rooms.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddRoom = async () => {
    try {
      const response = await addroom(newRoom.email, newRoom.name, newRoom.user_id);
      if (response.success) {
        setRooms([...rooms, response.room]);
        setNewRoom({ name: "", creator_id: localStorage.getItem("email") });
        setIsAddModalOpen(false);
        fetchRoom();
      } else {
        setErrors(response.message || "Thêm phòng thất bại");
      }
    } catch (err) {
      setErrors("Lỗi khi thêm phòng");
    }
  };

  const handleEditRoom = async () => {
    try {
      const response = await editroom(currentRoom.id, currentRoom.name);
      if (response.success) {
        // Cập nhật danh sách phòng
        setRooms((prevRooms) =>
          prevRooms.map((room) =>
            room.id === currentRoom.id ? { ...room, ...currentRoom } : room
          )
        );
        setIsEditModalOpen(false);
        setCurrentRoom(null);
      } else {
        setErrors(response.message || "Cập nhật phòng thất bại");
      }
    } catch (err) {
      setErrors("Lỗi khi cập nhật phòng");
    }
  };

  const handleDeleteRoom = async (id) => {
    try {
      const response = await deleteroom(id);
      if (response.success) {
        // Xóa phòng khỏi danh sách
        setRooms((prevRooms) => prevRooms.filter((room) => room.id !== id));
      } else {
        setErrors(response.message || "Xóa phòng thất bại");
      }
    } catch (err) {
      setErrors("Lỗi khi xóa phòng");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Chat Room Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          aria-label="Add new chat room"
        >
          <FiPlus className="mr-2" /> Add Room
        </button>
      </div>

      <div className="mb-6 relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search rooms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Search rooms"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avatar</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người tạo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRooms.map((room) => (
              <tr
                key={room.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={room.avatar}
                    alt={`${room.name} avatar`}
                    className="h-10 w-10 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = "images.unsplash.com/photo-1517245386807-bb43f82c33c4";
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.users && room.users[0] ? room.users[0].username : "Chưa có người dùng"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(room.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      setCurrentRoom(roomData);
                      setIsEditModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                    aria-label={`Edit ${roomData.name}`}
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteRoom(room.id)}
                    className="text-red-600 hover:text-red-900"
                    aria-label={`Delete ${room.name}`}
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Room Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Tạo nhóm</h2>
            <input
              type="text"
              placeholder="Room Name"
              value={newRoom.name}
              onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Thoát
              </button>
              <button
                onClick={handleAddRoom}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Tạo nhóm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {isEditModalOpen && currentRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Sửa</h2>
            <input
              type="text"
              placeholder="Room Name"
              value={currentRoom.name}
              onChange={(e) =>
                setCurrentRoom({ ...currentRoom, name: e.target.value })
              }
              className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Thoát
              </button>
              <button
                onClick={handleEditRoom}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoomManagement;

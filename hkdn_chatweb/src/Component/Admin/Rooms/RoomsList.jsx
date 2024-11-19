import React, { useState } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";

const ChatRoomManagement = () => {
  const [rooms, setRooms] = useState([
    {
      id: 1,
      name: "Product Development",
      avatar: "images.unsplash.com/photo-1522071820081-009f0129c71c",
      creator: "John Doe",
      createdAt: "2024-01-15T10:30:00"
    },
    {
      id: 2,
      name: "Marketing Team",
      avatar: "images.unsplash.com/photo-1522075469751-3a6694fb2f61",
      creator: "Jane Smith",
      createdAt: "2024-01-14T15:45:00"
    },
    {
      id: 3,
      name: "Design Squad",
      avatar: "images.unsplash.com/photo-1524758631624-e2822e304c36",
      creator: "Mike Wilson",
      createdAt: "2024-01-13T09:15:00"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [newRoom, setNewRoom] = useState({
    name: "",
    creator: ""
  });

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddRoom = () => {
    const room = {
      id: rooms.length + 1,
      ...newRoom,
      avatar: "images.unsplash.com/photo-1517245386807-bb43f82c33c4",
      createdAt: new Date().toISOString()
    };
    setRooms([...rooms, room]);
    setNewRoom({ name: "", creator: "" });
    setIsAddModalOpen(false);
  };

  const handleEditRoom = () => {
    const updatedRooms = rooms.map(room =>
      room.id === currentRoom.id ? { ...currentRoom } : room
    );
    setRooms(updatedRooms);
    setIsEditModalOpen(false);
    setCurrentRoom(null);
  };

  const handleDeleteRoom = (id) => {
    setRooms(rooms.filter(room => room.id !== id));
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
                    src={`https://${room.avatar}`}
                    alt={`${room.name} avatar`}
                    className="h-10 w-10 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = "images.unsplash.com/photo-1517245386807-bb43f82c33c4";
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.creator}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(room.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      setCurrentRoom(room);
                      setIsEditModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                    aria-label={`Edit ${room.name}`}
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

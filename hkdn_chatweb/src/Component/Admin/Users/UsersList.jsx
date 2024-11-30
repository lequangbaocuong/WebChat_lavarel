import React, { useState, useEffect } from "react";
import { FiSearch, FiEdit2, FiTrash2, FiX, FiCheck, FiPlus } from "react-icons/fi";
import { BiLoaderAlt } from "react-icons/bi";
import { adduser, getuser, edituser, deleteuser } from "../../api.js"
import axios from 'axios';
import NotificationPopup from '../../NotificationPopup.jsx'
import { FaSync } from "react-icons/fa";

const UserManagementDashboard = () => {
  const [users, setUsers] = useState([]);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await getuser();

      setUsers(response);


      setLoading(false);
    } catch (err) {
      setError("Không thể tải danh sách người dùng");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();

  }, []);
  /////////////////////////////////////////////////////
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    phone: "",
    address: ""
  });
  const [errors, setErrors] = useState({});

  const usersPerPage = 5;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const filteredUsers = users.filter(users =>

    users.username?.toLowerCase().includes(searchQuery.toLowerCase())


  );

  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      let response;
      if (selectedUser) {
        response = await edituser(selectedUser.id, formData.username, formData.email, formData.role);
      } else {
        response = await adduser(formData.username, formData.email, formData.role);
      }

      if (response?.success) {
        setNotificationMessage(selectedUser ? `Cập nhật thành công !` : `Thêm mới thành công !`);
        setShowNotification(true);
        fetchUsers();
        resetForm();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  /////////////////////////////////////////////////////
  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      role: "",
      phone: "",
      address: ""
    });
    setErrors({});
    setSelectedUser(null);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };
  const handleReset = async (user) => {
    setSelectedUser(user);
    const email = user.email;



    try {
      const response = await axios.post("http://localhost:8000/api/forgot-password", { email });

      if (response.data.success) {
        setNotificationMessage("Reset mật khẩu thành công");
      }
    } catch (error) {


    } finally {

    }

  };


  const confirmDelete = async () => {
    const response = await deleteuser(selectedUser.id);
    console.log(response.message);
    setIsLoading(true);
    setTimeout(() => {
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
      setIsLoading(false);
    }, 1000);
  };

  const handleEdit = (users) => {
    setSelectedUser(users);
    setFormData({
      username: users.username,
      email: users.email,
      role: users.role.name,
      phone: users.phone,
      address: users.address
    });
    setIsModalOpen(true);

  };


  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Quản Lý Người Dùng</h1>
            <div className="flex space-x-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FiSearch className="absolute right-3 top-3 text-gray-400" />
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
              >
                <FiPlus className="mr-2" /> Thêm mới
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.map((users) => (
                  <tr
                    key={users.id}
                    className={`hover:bg-gray-50 ${selectedUser?.id === users.id ? "bg-blue-50" : ""}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={`http://localhost:8000/storage/${users.avatar}`}
                          alt={users.username}
                          className="h-10 w-10 rounded-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/user.png";
                          }}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{users.username}</div>
                          <div className="text-sm text-gray-500">{users.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {users.role.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {users.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(users)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        aria-label="Edit user"
                      >
                        <FiEdit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(users)}
                        className="text-red-600 hover:text-red-900 mr-4"
                        aria-label="Delete user"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleReset(users)}
                        className="text-red-600 hover:text-red-900"
                        aria-label="Delete user"
                      >
                        <FaSync className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Trở lại
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={indexOfLastUser >= filteredUsers.length}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Tiếp theo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedUser ? "Edit" : "Add"} User</h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.role ? "border-red-500" : ""}`}
                >
                  <option value={formData.role}>{formData.role}</option>
                  <option value="2">User</option>
                  <option value="3">Morderate</option>
                </select>
                {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <>
                      <BiLoaderAlt className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiCheck className="mr-2" />
                      {selectedUser ? "Update" : "Create"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Xác nhận xóa</h2>
            <p className="text-gray-700 mb-6">Bạn có muốn xóa User {selectedUser?.name}? Hành động này không thể quay lại.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Thoát
              </button>
              <button
                onClick={confirmDelete}
                disabled={isLoading}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <BiLoaderAlt className="animate-spin mr-2" />
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <FiTrash2 className="mr-2" />
                    Xóa
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {showNotification && (

        <NotificationPopup message={notificationMessage} />
      )}
    </div>
  );
};

export default UserManagementDashboard;

import React, { useState } from "react";
import { FiMenu, FiX, FiPlus, FiUser, FiUsers, FiSettings } from "react-icons/fi";
import { BsCollection } from "react-icons/bs";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [error, setError] = useState("");

    const dummyGroups = [
        { id: 1, name: "Design Team", members: 8 },
        { id: 2, name: "Development Team", members: 12 },
        { id: 3, name: "Marketing Team", members: 6 },
        { id: 4, name: "Product Team", members: 10 }
    ];

    const user = {
        name: "John Doe",
        avatar: "images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3"
    };

    const handleCreateGroup = (e) => {
        e.preventDefault();
        if (!groupName.trim()) {
            setError("Please enter a group name");
            return;
        }
        // Handle group creation logic here
        setShowModal(false);
        setGroupName("");
        setError("");
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white"
                aria-label="Toggle Sidebar"
            >
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            <div
                className={`fixed top-0 left-0 h-full bg-gray-900 text-white transition-all duration-300 ease-in-out ${isOpen ? "w-64" : "w-0 lg:w-64"
                    } overflow-hidden shadow-xl z-40`}
            >
                <div className="p-6">
                    <button
                        onClick={() => setShowModal(true)}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                        aria-label="Create New Group"
                    >
                        <FiPlus size={20} />
                        <span>Create Group</span>
                    </button>

                    <div className="mt-8">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <BsCollection />
                            Your Groups
                        </h2>
                        <div className="space-y-2">
                            {dummyGroups.map((group) => (
                                <div
                                    key={group.id}
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div className="flex items-center gap-3">
                                        <FiUsers className="text-gray-400" />
                                        <span>{group.name}</span>
                                    </div>
                                    <span className="text-sm text-gray-400">{group.members}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-800">
                    <div className="flex items-center gap-3">
                        <img
                            src={`https://${user.avatar}`}
                            alt="User avatar"
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3";
                            }}
                        />
                        <div>
                            <p className="font-medium">{user.name}</p>
                            <button
                                className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
                                aria-label="Settings"
                            >
                                <FiSettings size={14} />
                                Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Create New Group</h3>
                        <form onSubmit={handleCreateGroup}>
                            <div className="mb-4">
                                <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Group Name
                                </label>
                                <input
                                    type="text"
                                    id="groupName"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter group name"
                                />
                                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setGroupName("");
                                        setError("");
                                    }}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;
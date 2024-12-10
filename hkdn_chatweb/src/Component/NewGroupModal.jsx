import React, { useState } from "react";
const NewGroupModal = ({ isOpen, onClose, onCreateGroup }) => {
    const [groupName, setGroupName] = useState("");

    const handleCreate = () => {
        onCreateGroup(groupName);
        setGroupName("");
        onClose();
    };

    return isOpen ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-4 bg-white rounded">
                <h2 className="mb-4 text-lg font-semibold">Tạo nhóm mới</h2>
                <input
                    type="text"
                    placeholder="Tên nhóm..."
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="p-2 mb-4 border border-gray-300 rounded"
                />
                <button onClick={handleCreate} className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                    Tạo
                </button>
                <button onClick={onClose} className="p-2 mt-2 text-white bg-red-500 rounded hover:bg-red-600">
                    Đóng
                </button>
            </div>
        </div>
    ) : null;
};
export default NewGroupModal;
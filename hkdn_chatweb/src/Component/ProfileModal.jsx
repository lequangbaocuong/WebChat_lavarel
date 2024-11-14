const ProfileModal = ({ isOpen, onClose }) => {
    return isOpen ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-4 bg-white rounded">
                <h2 className="mb-4 text-lg font-semibold">Thông tin cá nhân</h2>
                <button onClick={onClose} className="p-2 text-white bg-red-500 rounded hover:bg-red-600">
                    Đóng
                </button>
            </div>
        </div>
    ) : null;
};
export default ProfileModal;
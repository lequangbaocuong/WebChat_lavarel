const AvatarMenu = ({ onLogout }) => {
    return (
        <div className="flex items-center space-x-2">
            <img src="https://via.placeholder.com/40" alt="Avatar" className="w-10 h-10 rounded-full" />
            <button onClick={onLogout} className="p-2 text-white bg-red-500 rounded hover:bg-red-600">
                Đăng xuất
            </button>
        </div>
    );
};
export default AvatarMenu;
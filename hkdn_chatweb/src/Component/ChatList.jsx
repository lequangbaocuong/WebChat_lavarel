import { AiOutlineUserAdd, AiOutlineUsergroupAdd } from "react-icons/ai";
import { BsChatDotsFill, BsPeopleFill, BsGearFill, BsArchiveFill, BsListTask, BsThreeDotsVertical, BsSearch } from "react-icons/bs";

const ChatList = ({ contacts, searchQuery, setSearchQuery, setSelectedChat, selectedChat, handleCreateGroup }) => {
    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <div className="w-1/4 bg-white border-r border-gray-200 relative">
            <div className="p-4 border-b border-gray-200 mb-2">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-semibold">Tin nhắn</h1>
                    <div className="flex items-center space-x-2">
                        <button title="Thêm bạn">
                            <AiOutlineUserAdd className="text-gray-600 hover:text-blue-500" />
                        </button>
                        <button title="Tạo nhóm">
                            <AiOutlineUsergroupAdd className="text-gray-600 hover:text-blue-500" />
                        </button>
                    </div>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm"
                        className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <BsSearch className="absolute right-3 top-3 text-gray-500" />
                </div>
            </div>
            <div className="overflow-y-auto h-[calc(100vh-180px)]">
                {filteredContacts.map((contact) => (
                    <div
                        key={contact.id}
                        onClick={() => setSelectedChat(contact)}
                        className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${selectedChat?.id === contact.id ? "bg-gray-50" : ""
                            }`}
                    >
                        <div className="relative">
                            <img
                                src={contact.avatar}
                                alt={contact.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <span
                                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${contact.status === "online"
                                        ? "bg-green-500"
                                        : "bg-gray-500"
                                    }`}
                            ></span>
                        </div>
                        <div className="ml-4 flex-1">
                            <h2 className="font-semibold">{contact.name}</h2>
                            <p className="text-sm text-gray-600 truncate">{contact.lastMessage}</p>
                        </div>
                        <span className="text-xs text-gray-500">{contact.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default ChatList;
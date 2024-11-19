import { useEffect, useState } from "react";
import { debounce } from "../utils/utility";
import axios from "axios";
import Dialog from "./Dialog";

const GroupMemberModal = ({ isShowMemberModal, closeModal, users, group, addRoomUsers, removeRoomUser }) => {

    const [showAddMember, setShowAddMember] = useState(false);
    const [searchUsers, setSearchUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loadingAddMember, setLoadingAddMember] = useState(false);

    const [openDialog, SetOpenDialog] = useState(false);
    const [userToRemove, SetUserToRemove] = useState("");

    const [onLoadUsers, SetOnLoadUsers] = useState([]);

    const showAddMemberModal = () => {
        setShowAddMember(true)
    }

    const closeAddMemberModal = () => {
        setShowAddMember(false)
    }

    const search = (args) => {
        const value = args[0].target.value;

        if (value.length < 2) {
            setSearchUsers([]);
            return;
        }

        axios.get("http://localhost:8000/api/find-user", {
            params: {
                search: value
            }
        }, {
            // headers: {
            //     Authorization: `Bearer ${token}`,
            // },
        })
            .then(response => {
                if (value.length >= 2) {
                    const users = response.data.users.filter(u => u.id != group.creator_id);
                    setSearchUsers(users);
                }
            })
            .catch(error => {
                console.error("Error searching:", error);
            });
    }

    const processSearch = debounce(search, 300)

    const handleSearchChange = (e) => {
        processSearch(e);
    }

    const selectUser = (user) => {
        setSelectedUsers(oldArray => [...oldArray, user])
    }

    const deselectUser = (user) => {
        setSelectedUsers(selectedUsers.filter(u => u.id != user.id))
    }

    const addSelectedUsers = () => {
        const emails = selectedUsers.map((user) => user.email);
        const roomId = group.id;
        setLoadingAddMember(true);

        axios.post("http://localhost:8000/api/add-user-to-room", {
            room_id: roomId,
            emails: emails
        }, {
            // headers: {
            //     Authorization: `Bearer ${token}`,
            // },
        })
            .then(response => {
                setLoadingAddMember(false);
                addRoomUsers(response.data.users);
                setShowAddMember(false);
            })
            .catch(error => {
                console.error("Error adding members:", error);
            });
    }

    const removeUser = (user) => {
        SetUserToRemove(user);
        SetOpenDialog(true);
    }

    const removeUserFromLoadList = (user) => {
        SetOnLoadUsers(onLoadUsers.filter(u => u.id != user.id));
    }

    const confirmRemove = () => {
        SetOnLoadUsers([...onLoadUsers, userToRemove]);

        const roomId = group.id;
        const email = userToRemove.email;
        const token = localStorage.getItem("auth_token");

        console.log(roomId);
        console.log(email);

        axios.post("http://localhost:8000/api/remove-user-from-room", {
            room_id: roomId,
            email: email
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                // console.log(response.data);
                removeRoomUser(userToRemove);
                removeUserFromLoadList(userToRemove);
            })
            .catch(error => {
                console.error("Error remove members:", error);
            });
    }

    const userList = users.map((user) =>
        <li key={user.id}>
            <div className="flex items-center gap-4 hover:bg-gray-200 group">
                <img
                    className="w-11 h-11 rounded-full"
                    src="https://inkythuatso.com/uploads/thumbnails/800/2023/03/6-anh-dai-dien-trang-inkythuatso-03-15-26-36.jpg"
                    alt="" />
                <div className="items-center">
                    <div className="text-sm font-medium pl-1">{user.username}</div>

                    {/* show user's roles here */}
                    <div className="">
                        {user.id == group.creator_id &&
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Owner</span>
                        }
                        {/* <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Owner</span> */}
                    </div>
                </div>
                {onLoadUsers.includes(user) &&
                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 text-blue animate-spin ms-auto me-2" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                    </svg>
                }
                {!onLoadUsers.includes(user) &&
                    <div className="flex ms-auto items-center">
                        {/* <button 
                        type="button" 
                        className="text-gray-400 bg-transparent hidden group-hover:inline-flex hover:text-gray-900 rounded-lg text-sm w-8 h-8 justify-center items-center">
                        <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fill-rule="evenodd" d="M17 10v1.126c.367.095.714.24 1.032.428l.796-.797 1.415 1.415-.797.796c.188.318.333.665.428 1.032H21v2h-1.126c-.095.367-.24.714-.428 1.032l.797.796-1.415 1.415-.796-.797a3.979 3.979 0 0 1-1.032.428V20h-2v-1.126a3.977 3.977 0 0 1-1.032-.428l-.796.797-1.415-1.415.797-.796A3.975 3.975 0 0 1 12.126 16H11v-2h1.126c.095-.367.24-.714.428-1.032l-.797-.796 1.415-1.415.796.797A3.977 3.977 0 0 1 15 11.126V10h2Zm.406 3.578.016.016c.354.358.574.85.578 1.392v.028a2 2 0 0 1-3.409 1.406l-.01-.012a2 2 0 0 1 2.826-2.83ZM5 8a4 4 0 1 1 7.938.703 7.029 7.029 0 0 0-3.235 3.235A4 4 0 0 1 5 8Zm4.29 5H7a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h6.101A6.979 6.979 0 0 1 9 15c0-.695.101-1.366.29-2Z" clip-rule="evenodd"/>
                        </svg>
                    </button> */}
                        {user.id != group.creator_id &&
                            <button
                                onClick={() => removeUser(user)}
                                type="button"
                                className="text-gray-400 bg-transparent hidden group-hover:inline-flex hover:text-gray-900 rounded-lg text-sm w-8 h-8 justify-center items-center">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                            </button>
                        }
                    </div>
                }
            </div>
        </li>
    );

    const searchUserList = searchUsers.map((user) =>
        <li key={user.id}>
            <div className="flex items-center gap-4 justify-between">
                <img
                    className="w-11 h-11 rounded-full"
                    src="https://inkythuatso.com/uploads/thumbnails/800/2023/03/6-anh-dai-dien-trang-inkythuatso-03-15-26-36.jpg"
                    alt="" />
                <div className="flex-1 items-center">
                    <div className="text-sm font-medium">{user.username}</div>
                    <div className="text-sm">{user.email}</div>
                </div>
                {/* <input
                onClick={() => selectUser(user)}
                disabled={selectedUsers.includes(user)}
                type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"></input> */}
                <button
                    onClick={() => selectUser(user)}
                    disabled={selectedUsers.includes(user)}
                    type="button"
                    className="text-white bg-blue-500 hover:bg-blue-400 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center ms-auto disabled:pointer-events-none disabled:hidden">
                    <svg className="w-3 h-3 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7V5" />
                    </svg>
                </button>
            </div>
        </li>
    )

    const selectedUserList = selectedUsers.map((user) =>
        <li key={user.id}>
            <div className="flex items-center gap-4 justify-between">
                <img
                    className="w-11 h-11 rounded-full"
                    src="https://inkythuatso.com/uploads/thumbnails/800/2023/03/6-anh-dai-dien-trang-inkythuatso-03-15-26-36.jpg"
                    alt="" />
                <div className="flex-1 items-center">
                    <div className="text-sm font-medium">{user.username}</div>
                    <div className="text-sm">{user.email}</div>
                </div>
                {/* <input 
                onClick={() => deselectUser(user)}
                type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"></input> */}
                <button
                    onClick={() => deselectUser(user)}
                    disabled={loadingAddMember}
                    type="button"
                    className="text-white bg-blue-500 hover:bg-blue-400 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center ms-auto">
                    <svg className="w-3 h-3 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14" />
                    </svg>
                </button>
            </div>
        </li>
    )

    useEffect(() => {
        if (showAddMember) {
            setSearchUsers([]);
            setSelectedUsers([]);
        }
    }, [showAddMember]);

    return (<>
        {isShowMemberModal && (
            <div className="fixed inset-0 bg-gray-700 bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg w-96 shadow-lg max-h-[calc(2/3*100%)] flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Members</h3>
                        <button
                            onClick={closeModal}
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="">
                        <button
                            onClick={showAddMemberModal}
                            className="w-full py-1 rounded-md bg-gray-300 hover:bg-gray-100 transition-colors"
                        >
                            Add members
                        </button>
                    </div>
                    <div className="flex-1 mt-6 h-full overflow-y-auto">
                        <ul className="space-y-6">
                            {userList}
                        </ul>
                    </div>
                </div>
            </div>
        )}


        {showAddMember && (
            <div className="fixed inset-0 bg-gray-700 bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg w-96 shadow-lg max-h-[calc(2/3*100%)] flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Add members</h3>
                        <button
                            onClick={closeAddMemberModal}
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Search"
                            onChange={handleSearchChange}
                            className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {selectedUsers.length > 0 && (
                        <div className="flex-1 mt-3 h-full border-t border-b py-2 overflow-y-auto">
                            <button
                                onClick={() => addSelectedUsers()}
                                disabled={loadingAddMember}
                                type="button" className="w-full justify-center text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center">
                                {loadingAddMember && <svg aria-hidden="true" role="status" className="inline w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                </svg>}
                                {!loadingAddMember && <span>Add</span>}
                            </button>
                            <ul className="space-y-6 mt-3">
                                {selectedUserList}
                            </ul>
                        </div>
                    )}
                    <div className="flex-1 mt-6 h-full overflow-y-auto">
                        <ul className="space-y-6">
                            {searchUserList}
                        </ul>
                    </div>
                </div>
            </div>
        )}

        <Dialog
            title="Remove"
            message={`Remove ${userToRemove.username} from the group?`}
            open={openDialog}
            onClose={() => SetOpenDialog(false)}
            onConfirm={confirmRemove}
        />

    </>)
}

export default GroupMemberModal;
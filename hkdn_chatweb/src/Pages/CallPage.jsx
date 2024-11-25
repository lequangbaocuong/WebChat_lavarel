import { useEffect, useState } from "react"
import { JitsiMeeting } from "@jitsi/react-sdk"
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from "axios";

const CallPage = () => {
    const [searchParams] = useSearchParams();
    const [jitsiApi, setJitsiApi] = useState();
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [userName, setUserName] = useState('');

    const domain = "localhost:8443";

    const userInfo = {
        displayName: userName
    }

    const config = {
        startWithAudioMuted: true,
        disableModeratorIndicator: true,
        enableEmailInStats: false,
        prejoinConfig: {
            enabled: false
        },
        conferenceInfo: {
            // those labels will not be hidden in tandem with the toolbox.
            alwaysVisible: ['recording'],
            // those labels will be auto-hidden in tandem with the toolbox buttons.
            autoHide: []
        },
        toolbarButtons: [
            'camera',
            'desktop',
            'fullscreen',
            'hangup',
            'microphone',
            'participants-pane',
            'settings',
            'toggle-camera',
            'tileview'
        ],
        mainToolbarButtons: [
            [ 'microphone', 'camera', 'desktop', 'participants-pane'],
            [ 'microphone', 'camera', 'desktop', 'participants-pane'],
            [ 'microphone', 'camera', 'desktop', 'participants-pane'],
            [ 'microphone', 'camera', 'desktop', 'participants-pane'],
            [ 'microphone', 'camera', 'desktop', 'participants-pane'],
            [ 'microphone', 'camera', 'desktop' ],
            [ 'microphone', 'camera' ]
        ],
        breakoutRooms: {
            hideAddRoomButton: true,
            hideAutoAssignButton: true,
            hideJoinRoomButton: true
        },
        enableClosePage: true,
        defaultLanguage: "en",
    }

    const interfaceConfig = {
        APP_NAME: "HKDN",
        HIDE_INVITE_MORE_HEADER: true,
        MOBILE_APP_PROMO: false,
        SHOW_JITSI_WATERMARK: false,
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
    }

    function handleJitsiApi(externalApi) {
        setJitsiApi(externalApi);

        externalApi.addEventListener(`videoConferenceJoined`, () => {
            const listener = ({ enabled }) => {
                externalApi.removeEventListener(`tileViewChanged`, listener);
        
                if (!enabled) {
                    externalApi.executeCommand(`toggleTileView`);
                }
            };
        
            externalApi.addEventListener(`tileViewChanged`, listener);
            externalApi.executeCommand(`toggleTileView`);
        });

        externalApi.addEventListener(`readyToClose`, ()=>{
            leaveCall();
        })
    }

    const leaveCall = async () => {
        try {
            const token = localStorage.getItem("auth_token");
            const roomId = searchParams.get('roomId');
            const response = await axios.post(
                `http://127.0.0.1:8000/api/room/${roomId}/leave-call`,
                {},
                { 
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
    
            console.log(response.data);
            window.close();
        } catch (error) {
            console.error("Error:", error);
            setSuccess(false);
        }
    }

    const fetchProfile = async () => {
        try {
            const email = localStorage.getItem("user_email");

            if (!email) {
                return;
            }

            const response = await axios.post("http://127.0.0.1:8000/api/user/profile", {
                email: email,
            });

            setUserName(response.data.name);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const fetchCallRoom = async () => {
        try {
            const token = localStorage.getItem("auth_token");
            const roomId = searchParams.get('roomId');
            const response = await axios.post(
                `http://127.0.0.1:8000/api/room/${roomId}/make-call`,
                {},
                { 
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
    
            console.log(response.data.call_room);
            setRoomName(response.data.call_room);
            setSuccess(true);
        } catch (error) {
            console.error("Error:", error);
            setSuccess(false);
        }
        setLoading(false);
    }

    const initCallRoom = async () => {
        await fetchProfile();
        fetchCallRoom();
    }

    const sendHeartbeat = () => {
        const token = localStorage.getItem("auth_token");
        const roomId = searchParams.get('roomId');
        axios.post(`http://127.0.0.1:8000/api/room/${roomId}/heartbeat`, {},
            {
                headers: { Authorization: `Bearer ${token}` },
            },
        ).catch(error => {
            console.error("Error heartbeat:", error);
        });
    }

    useEffect(() => {
        
        initCallRoom();

        const interval = setInterval(sendHeartbeat, 60000);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-dvh bg-gray-800">
            {loading ?
            <div className="justify-center items-center h-full flex">
                <svg aria-hidden="true" className="inline w-10 h-10 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
            </div>
            :
            success?
            <JitsiMeeting
                domain={domain}
                roomName={roomName}
                configOverwrite={config}
                interfaceConfigOverwrite={interfaceConfig}
                userInfo={userInfo}
                onApiReady={handleJitsiApi}
                getIFrameRef={ (iframeRef) => { iframeRef.className="h-full" } }
            />
            :
            <div className="justify-center items-center h-full flex">
                <span className="text-white font-medium text-xl">Lỗi kết nối</span>
            </div>
            }
        </div>
    );
}

export default CallPage
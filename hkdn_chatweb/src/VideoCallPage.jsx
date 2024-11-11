import { useState } from 'react'

function ParticipantTile() {
    const total = 4;
    let gridCols;
    switch (total) {
        case 1:
            gridCols = 'grid-cols-1';
            break;
        case 2:
            gridCols = 'grid-cols-1 sm:grid-cols-2';
            break;
        case 3:
        case 4:
            gridCols = 'grid-cols-2';
            break;
        case 5:
        case 6:
            gridCols = 'grid-cols-2 sm:grid-cols-3';
            break;
        default:
            gridCols = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4';
            break;
    }

    const listItems = Array.from({length: total}, (_, i) => i + 1).map((number) =>
            <div className="h-full p-2">
                <div className="group relative inline-flex rounded-lg bg-gray-600 w-full h-full items-center justify-center">
                    <div class="relative inline-flex items-center justify-center w-16 h-16 overflow-hidden bg-gray-100 rounded-full">
                        <span class="font-semibold text-xl text-gray-600 select-none">WD</span>
                    </div>
                    <div class="absolute left-2 bottom-2 bg-gray-700 rounded-lg px-2 py-1 text-sm text-white group-hover:block hidden">Participant Name</div>
                </div>
            </div>
    );

    return (
        <div className="flex-1 p-2 content-center">
            <div className={`grid ${gridCols} h-full items-center justify-center`}>
                {listItems}
            </div>
        </div>
    );
}

function PeopleList({open, onClose}) {
    return (
        <div className={`fixed top-0 right-0 pb-20 sm:static sm:pb-4 py-4 pr-4 w-72 h-full overflow-y-auto ${open ? "visible" : "hidden"}`}>
            <div className="flex flex-col h-full rounded-lg bg-white w-full overflow-y-auto">
                <div class="flex items-center justify-between px-3 py-2 border-b rounded-t border-gray-300">
                    <h3 class="text-xl font-semibold text-gray-900">
                        People
                    </h3>
                    <button onClick={onClose} type="button" class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="authentication-modal">
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <div className="h-full overflow-y-autorounded-lg p-3 space-y-4">
                    <div className="flex items-center">
                        <div className="relative w-10 h-10 overflow-hidden bg-gray-300 rounded-full">
                            <svg className="absolute w-12 h-12 text-gray-500 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                        </div>
                        <span className="text-black ml-4">John Doe</span>
                    </div>
                    <div className="flex items-center">
                        <div className="relative w-10 h-10 overflow-hidden bg-gray-300 rounded-full">
                            <svg className="absolute w-12 h-12 text-gray-500 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                        </div>
                        <span className="text-black ml-4">John Doe</span>
                    </div>
                    <div className="flex items-center">
                        <div className="relative w-10 h-10 overflow-hidden bg-gray-300 rounded-full">
                            <svg className="absolute w-12 h-12 text-gray-500 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                        </div>
                        <span className="text-black ml-4">John Doe</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ControlBar({open, togglePeopleList}) {
    return (
        <div class="z-50 grid w-full h-16 grid-cols-3 px-8 border-t md:grid-cols-3 bg-gray-800 border-gray-700">
            <div class="items-center justify-center text-white me-auto flex">
                <svg class="w-3 h-3 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z"/>
                </svg>
                <span class="text-sm">12:43 PM</span>
            </div>
            <div class="flex items-center justify-center mx-auto">
                <button type="button" class="p-2.5 group rounded-full me-4 focus:ring-gray-800 bg-gray-600 hover:bg-gray-800">
                    <svg class="w-4 h-4 text-white group-hover:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 19">
                        <path d="M15 5a1 1 0 0 0-1 1v3a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a1 1 0 0 0-2 0v3a6.006 6.006 0 0 0 6 6h1v2H5a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2H9v-2h1a6.006 6.006 0 0 0 6-6V6a1 1 0 0 0-1-1Z"/>
                        <path d="M9 0H7a3 3 0 0 0-3 3v5a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3Z"/>
                    </svg>
                    <span class="sr-only">Mute microphone</span>
                </button>
                <button type="button" class="p-2.5 group rounded-full me-4 focus:ring-gray-800 bg-gray-600 hover:bg-gray-800">
                    <svg class="w-4 h-4 text-white group-hover:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
                        <path d="M11 0H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm8.585 1.189a.994.994 0 0 0-.9-.138l-2.965.983a1 1 0 0 0-.685.949v8a1 1 0 0 0 .675.946l2.965 1.02a1.013 1.013 0 0 0 1.032-.242A1 1 0 0 0 20 12V2a1 1 0 0 0-.415-.811Z"/>
                    </svg>
                    <span class="sr-only">Hide camera</span>
                </button>
                <button type="button" class="p-2.5 group rounded-full me-4 focus:ring-gray-800 bg-gray-600 hover:bg-gray-800">
                    <svg class="w-4 h-4 text-white group-hover:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2"/>
                    </svg>
                    <span class="sr-only">Video settings</span>
                </button>
                <button type="button" class="p-2.5 group rounded-full me-4 md:me-0 focus:ring-gray-800 bg-red-600 hover:bg-gray-800">
                    <svg class="w-4 h-4 text-white group-hover:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 6.995c-2.306 0-4.534.408-6.215 1.507-1.737 1.135-2.788 2.944-2.797 5.451a4.8 4.8 0 0 0 .01.62c.015.193.047.512.138.763a2.557 2.557 0 0 0 2.579 1.677H7.31a2.685 2.685 0 0 0 2.685-2.684v-.645a.684.684 0 0 1 .684-.684h2.647a.686.686 0 0 1 .686.687v.645c0 .712.284 1.395.787 1.898.478.478 1.101.787 1.847.787h1.647a2.555 2.555 0 0 0 2.575-1.674c.09-.25.123-.57.137-.763.015-.2.022-.433.01-.617-.002-2.508-1.049-4.32-2.785-5.458-1.68-1.1-3.907-1.51-6.213-1.51Z"/>
                    </svg>
                    <span class="sr-only">Leave</span>
                </button>
            </div>
            <div class="items-center justify-center ms-auto flex">
                <button 
                onClick={togglePeopleList}
                type="button" 
                class={`p-2.5 group rounded-full hover:bg-gray-600 ${open ? "bg-gray-800" : ""}`}>
                    <svg class="w-4 h-4 text-white group-hover:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                        <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
                    </svg>
                    <span class="sr-only">Show participants</span>
                </button>
            </div>
        </div>
    );
}

const VideoCallPage = () => {
    const [open, setOpen] = useState(false)

    function closePeopleList() {
        setOpen(false)
    }

    function togglePeopleList() {
        setOpen(!open)
    }

    return (
        <div className="h-dvh w-dvw bg-gray-950">
            <div className="flex flex-col w-full h-full">
                <div className="flex w-full flex-1 overflow-y-auto">
                    <ParticipantTile />
                    <PeopleList open={open} onClose={closePeopleList} />
                    
                </div>  

                <ControlBar open={open} togglePeopleList={togglePeopleList} />
            </div>
        </div>        
    );
}

export default VideoCallPage;
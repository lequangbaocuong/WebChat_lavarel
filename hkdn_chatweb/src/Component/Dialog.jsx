const Dialog = ({ title, message, open, onClose, onConfirm }) => {
    return (<>
        {open && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-700 bg-opacity-50">
                <div className="bg-white p-8 rounded-lg w-96 shadow-lg absolute top-20">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{title}</h3>
                        <button
                            onClick={() => onClose()}
                            type="button" 
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="mb-4">
                        <span>{message}</span>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => {
                                onClose();
                            }}
                            className="py-1 px-2 rounded-md bg-gray-300 hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onClose();
                                onConfirm();
                            }}
                            className="py-1 px-2 rounded-md bg-gray-300 hover:bg-gray-100 transition-colors"
                        >
                            Ok
                        </button>
                    </div>
                </div>
            </div>
        )}
    </>);
}

export default Dialog;
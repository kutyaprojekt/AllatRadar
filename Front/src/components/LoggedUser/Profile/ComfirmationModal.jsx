import React from 'react';

const ConfirmationModal = ({ title, message, onConfirm, onCancel, theme, visszajelzes, setVisszajelzes }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`p-6 rounded-lg shadow-xl w-full max-w-md ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                <h3 className={`text-xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>{title}</h3>
                <p className={`mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{message}</p>
                
                <div className="mb-6">
                    <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-white" : "text-gray-700"}`}>
                        Írd meg a történetet (opcionális):
                    </label>
                    <textarea
                        value={visszajelzes}
                        onChange={(e) => setVisszajelzes(e.target.value)}
                        className={`w-full p-3 border rounded-lg ${
                            theme === "dark" 
                                ? "bg-gray-700 text-white border-gray-600" 
                                : "bg-white text-gray-900 border-gray-300"
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        rows={4}
                        placeholder="Írd meg, hogyan találtad meg az állatodat..."
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className={`px-4 py-2 rounded-lg font-medium ${
                            theme === "dark" 
                                ? "bg-gray-600 hover:bg-gray-700 text-white" 
                                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                        } transition duration-300`}
                    >
                        Mégse
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-lg font-medium ${
                            theme === "dark" 
                                ? "bg-green-600 hover:bg-green-700 text-white" 
                                : "bg-green-500 hover:bg-green-600 text-white"
                        } transition duration-300`}
                    >
                        Igen, megtaláltam
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
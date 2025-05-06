import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
    const { theme } = useTheme();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onCancel}></div>
            <div className={`relative z-[101] p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 ${
                theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}>
                <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>
                    {message}
                </h3>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            theme === 'dark'
                                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                        }`}
                    >
                        <FaTimes className="inline-block mr-2" />
                        Mégse
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            theme === 'dark'
                                ? 'bg-[#1A73E8] hover:bg-[#1557B0] text-white'
                                : 'bg-[#1A73E8] hover:bg-[#1557B0] text-white'
                        }`}
                    >
                        <FaCheck className="inline-block mr-2" />
                        Igen
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
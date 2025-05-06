import React, { useState } from 'react';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
import { useTheme } from '../../context/ThemeContext';
import { FaPaw, FaClock, FaMapMarkerAlt, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const FoundAnimalsTemplate = ({ animal }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { theme } = useTheme();

    const formatDate = (dateString) => {
        if (!dateString) return "Ismeretlen dátum";
        try {
            return format(new Date(dateString), 'yyyy. MMMM d.', { locale: hu });
        } catch (error) {
            return "Érvénytelen dátum";
        }
    };

    const formatElapsedTime = (dateString) => {
        if (!dateString) return "Ismeretlen dátum";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "Érvénytelen dátum";
            
            // Use the same formatDate function that's already defined
            return formatDate(dateString);
        } catch (error) {
            console.error("Dátum formázási hiba:", error);
            return "Érvénytelen dátum";
        }
    };

    const truncateText = (text, maxLength = 100) => {
        if (!text) return "Nincs visszajelzés";
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    const openModal = () => {
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'auto';
    };

    return (
        <div className={`${theme === "dark" 
            ? "bg-gray-800 border-gray-700 border-2 shadow-xl shadow-gray-900/40" 
            : "bg-white border border-gray-200"
        } rounded-xl overflow-hidden w-[350px] mx-auto flex flex-col h-full`}>
            {/* Kép rész */}
            <div className="w-full h-64 overflow-hidden relative">
                {animal.filePath ? (
                    <img
                        src={`http://localhost:8000/${animal.filePath}`}
                        alt={animal.allatfaj || "Állat"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = "https://via.placeholder.com/400x300";
                        }}
                    />
                ) : (
                    <div className={`w-full h-full flex items-center justify-center ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                        <FaPaw className="w-16 h-16 text-gray-400" />
                    </div>
                )}
                <div className={`absolute top-0 right-0 mt-3 mr-3 px-2 py-1 rounded-full text-xs font-semibold ${
                    theme === "dark" 
                        ? "bg-green-800 text-white" 
                        : "bg-green-100 text-green-800"
                }`}>
                    Megtalálva
                </div>
            </div>
            
            {/* Tartalom rész */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center mb-3">
                    <h2 className={`text-xl font-bold flex items-center gap-2 ${
                        theme === "dark" ? "text-white" : "text-gray-800"
                    }`}>
                        <FaPaw className="text-yellow-500" />
                        {animal.allatfaj || "Ismeretlen faj"}
                    </h2>
                </div>

                <div className="flex flex-col gap-2 mb-3">
                    <div className="flex items-center gap-2">
                        <FaClock className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
                        <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                            Feltöltés dátuma: {formatDate(animal.datum)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaCheckCircle className={`${theme === "dark" ? "text-green-400" : "text-green-500"}`} />
                        <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                            Megtalálás dátuma: {formatDate(animal.mikorveszettel || animal.datum)}
                        </span>
                    </div>
                </div>

                <div className="mb-4">
                    <div className={`${
                        theme === "dark" 
                            ? "bg-gray-900 border border-gray-700" 
                            : "bg-gray-50"
                    } p-3 rounded-lg`}>
                        <h3 className={`font-semibold flex items-center gap-2 mb-2 ${
                            theme === "dark" ? "text-gray-100" : "text-gray-700"
                        }`}>
                            <FaInfoCircle className="text-yellow-500" />
                            Visszajelzés:
                        </h3>
                        <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                            {truncateText(animal.visszajelzes, 100)}
                        </p>
                        {animal.visszajelzes && animal.visszajelzes.length > 100 && (
                            <button 
                                onClick={openModal}
                                className={`mt-2 text-xs font-medium ${theme === "dark" ? "text-green-400 hover:text-green-300" : "text-green-600 hover:text-green-700"}`}
                            >
                                Teljes történet megtekintése
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-auto flex justify-between items-center">
                    <span className={`text-xs flex items-center gap-1 ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}>
                        <FaMapMarkerAlt className="text-green-500" />
                        {animal.helyszin || animal.eltuneshelyszine || animal.telepules || animal.varos || "Ismeretlen hely"}
                    </span>
                </div>
            </div>

            {/* Teljes történet modal */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Teljes sikertörténet"
                className={`relative max-w-2xl w-full p-6 md:p-8 rounded-2xl shadow-2xl ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"} max-h-[90vh] overflow-y-auto mx-auto`}
                overlayClassName="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70"
                style={{
                    overlay: {
                        backdropFilter: 'blur(5px)',
                        zIndex: 1000
                    }
                }}
            >
                <button 
                    onClick={closeModal}
                    className="absolute top-3 right-3 p-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <div>
                    <h2 className="text-xl md:text-2xl font-bold mb-3">{animal.allatfaj || "Ismeretlen állat"} sikertörténete</h2>
                    <div className="flex flex-col md:flex-row gap-6 mb-4">
                        <div className="flex items-center gap-2">
                            <FaClock className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
                            <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                                Feltöltés dátuma: {formatDate(animal.datum)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaCheckCircle className={`${theme === "dark" ? "text-green-400" : "text-green-500"}`} />
                            <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                                Megtalálás dátuma: {formatDate(animal.mikorveszettel || animal.datum)}
                            </span>
                        </div>
                    </div>
                    <div className="prose max-w-none" style={{ whiteSpace: 'pre-line' }}>
                        <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                            {animal.visszajelzes || "Nincs visszajelzés"}
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default FoundAnimalsTemplate;
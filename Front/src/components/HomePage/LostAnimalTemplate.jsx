import React, { useState, useEffect } from 'react';
import AnimalDetailsModal from './AnimalDetailsModal';
import { useTheme } from '../../context/ThemeContext';
import { FaPaw, FaClock, FaMapMarkerAlt, FaInfoCircle } from 'react-icons/fa';

const LostAnimalTemplate = ({ animal }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const { theme } = useTheme();

    const handleOpenModal = () => {
        setScrollPosition(window.pageYOffset);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'auto';
        
        requestAnimationFrame(() => {
            window.scrollTo({
                top: scrollPosition,
                behavior: 'instant'
            });
        });
    };

    useEffect(() => {
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const formatElapsedTime = (dateString) => {
        if (!dateString) return "Ismeretlen dátum";

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "Érvénytelen dátum";

            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();

            return `${year}.${month.toString().padStart(2, '0')}.${day.toString().padStart(2, '0')}`;
        } catch (error) {
            return "Érvénytelen dátum";
        }
    };

    const truncateText = (text, maxLength = 100) => {
        if (!text) return "Nincs";
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    return (
        <div className={`${theme === "dark"
            ? "bg-gray-800 border-gray-700 border-2 shadow-xl shadow-gray-900/40"
            : "bg-white border border-gray-200"
            } rounded-xl overflow-hidden w-[350px] mx-auto flex flex-col h-full`}>
            <div className="w-full h-64 overflow-hidden relative">
                {animal.filePath && (
                    <img
                        src={`http://localhost:8000/${animal.filePath}`}
                        alt={animal.allatfaj || "Állat"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = "https://via.placeholder.com/400x300";
                        }}
                    />
                )}
                <div className={`absolute top-0 right-0 mt-3 mr-3 px-2 py-1 rounded-full text-xs font-semibold ${theme === "dark"
                        ? "bg-red-800 text-white"
                        : "bg-red-100 text-red-800"
                    }`}>
                    Elveszett
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center mb-3">
                    <h2 className={`text-xl font-bold flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-800"
                        }`}>
                        <FaPaw className="text-yellow-500" />
                        {animal.allatfaj || "Ismeretlen faj"}
                    </h2>
                </div>

                <div className="flex flex-col gap-2 mb-3">
                    <div className="flex items-center gap-2">
                        <FaClock className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
                        <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                            Feltöltés dátuma: {formatElapsedTime(animal.datum)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaClock className={`${theme === "dark" ? "text-red-400" : "text-red-500"}`} />
                        <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                            Eltűnés dátuma: {formatElapsedTime(animal.elveszesIdeje || animal.datum)}
                        </span>
                    </div>
                </div>

                <div className="mb-4">
                    <div className={`${theme === "dark"
                            ? "bg-gray-900 border border-gray-700"
                            : "bg-gray-50"
                        } p-3 rounded-lg`}>
                        <h3 className={`font-semibold flex items-center gap-2 mb-2 ${theme === "dark" ? "text-gray-100" : "text-gray-700"
                            }`}>
                            <FaInfoCircle className="text-yellow-500" />
                            Egyéb információk:
                        </h3>
                        <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                            {truncateText(animal.egyeb_info)}
                        </p>
                    </div>
                </div>

                <div className="mt-auto flex justify-between items-center">
                    <span className={`text-xs flex items-center gap-1 ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}>
                        <FaMapMarkerAlt className="text-red-500" />
                        {animal.helyszin || animal.eltuneshelyszine || animal.telepules || animal.varos || "Ismeretlen hely"}
                    </span>
                    <button
                        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 ${theme === "dark"
                                ? "bg-gray-600 hover:bg-gray-500 text-white"
                                : "bg-blue-500 hover:bg-blue-600 text-white"
                            }`}
                        onClick={handleOpenModal}
                    >
                        <FaPaw className="text-sm" />
                        Részletek
                    </button>
                </div>
            </div>

            <AnimalDetailsModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                animal={animal}
                scrollPosition={scrollPosition}
            />
        </div>
    );
}

export default LostAnimalTemplate;
import React, { useEffect } from 'react';
import { useTheme } from "../../context/ThemeContext";
import Modal from 'react-modal';
import { FaTimes, FaPaw, FaCalendarAlt, FaMapMarkerAlt, FaInfoCircle, FaVenusMars, FaRuler, FaUser, FaEnvelope, FaPhone, FaCheck, FaTimes as FaTimesIcon } from "react-icons/fa";

Modal.setAppElement('#root');

const AnimalDetailsModal = ({ isOpen, onClose, animal }) => {
    const { theme } = useTheme();
    const bgColor = theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900";
    const cardBg = theme === "dark" ? "bg-gray-800" : "bg-gray-100";
    const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600";
    const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";

    const handleAfterOpen = () => {
        document.body.style.overflow = 'hidden';
    };

    const handleAfterClose = () => {
        document.body.style.overflow = 'auto';
    };

    useEffect(() => {
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            onAfterOpen={handleAfterOpen}
            onAfterClose={handleAfterClose}
            contentLabel="Állat részletes adatai"
            className={`${bgColor} rounded-xl p-8 w-11/12 max-w-4xl mx-auto relative shadow-2xl border ${borderColor}`}
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pt-16"
            style={{
                overlay: {
                    backdropFilter: 'blur(4px)',
                    zIndex: 1000
                },
                content: {
                    position: 'relative',
                    top: 'auto',
                    maxHeight: '80vh',
                    overflowY: 'auto'
                }
            }}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-md"
            >
                <FaTimes className="text-lg" />
            </button>

            {animal && (
                <div className="flex flex-col gap-10">
                    {/* Fő információs blokk */}
                    <div className="flex flex-col md:flex-row gap-10">
                        {/* Bal oldali kép */}
                        {animal.filePath && (
                            <div className="w-full md:w-1/3 flex justify-center">
                                <div className="w-60 h-60 rounded-lg overflow-hidden shadow-lg border-2 border-gray-300">
                                    <img
                                        src={`http://localhost:8000/${animal.filePath}`}
                                        alt={animal.allatfaj}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Jobb oldali információk */}
                        <div className="w-full md:w-2/3 flex flex-col gap-6">
                            <div className="text-center md:text-left">
                                <h2 className="text-3xl font-bold flex items-center gap-2">
                                    <FaPaw className="text-yellow-500" /> {animal.allatfaj}
                                </h2>
                                <p className={`${textSecondary} text-lg`}>
                                    {animal.kategoria ? animal.kategoria : ""}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className={`${cardBg} p-5 rounded-xl shadow-md flex items-center gap-3`}>
                                    <FaCalendarAlt className="text-2xl text-blue-500" />
                                    <p><strong>Dátum:</strong> {animal.datum}</p>
                                </div>

                                <div className={`${cardBg} p-5 rounded-xl shadow-md flex items-center gap-3`}>
                                    <FaMapMarkerAlt className="text-2xl text-red-500" />
                                    <p><strong>Helyszín:</strong> {animal.helyszin || animal.eltuneshelyszine}</p>
                                </div>

                                <div className={`${cardBg} p-5 rounded-xl shadow-md flex items-center gap-3`}>
                                    <FaVenusMars className="text-2xl text-pink-500" />
                                    <p><strong>Nem:</strong> {animal.neme || animal.allatneme}</p>
                                </div>

                                <div className={`${cardBg} p-5 rounded-xl shadow-md flex items-center gap-3`}>
                                    <FaRuler className="text-2xl text-green-500" />
                                    <p><strong>Méret:</strong> {animal.meret}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Egyéb információk és tulajdonos adatai egymás mellett */}
                    <div className="flex flex-col md:flex-row gap-6">
                        {animal.user && (
                            <div className="p-4 rounded-xl shadow-md border border-blue-300 bg-blue-100 dark:bg-blue-900 md:w-72 h-fit">
                                <h4 className="text-xl font-semibold flex items-center gap-2 text-blue-700 dark:text-blue-300">
                                    <FaUser className="text-2xl" /> Tulajdonos adatai
                                </h4>
                                <div className="mt-2 space-y-1">
                                    <p className="flex items-center gap-2">
                                        <FaUser className="text-blue-500" /> <strong>Név:</strong> {animal.user.username}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <FaEnvelope className="text-blue-500" /> <strong>Email:</strong> {animal.user.email}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <FaPhone className="text-blue-500" /> <strong>Telefonszám:</strong> {animal.user.phonenumber}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Egyéb információk */}
                        <div className={`${cardBg} p-5 rounded-xl shadow-md flex-1`}>
                            <h3 className="font-semibold flex items-center gap-2 text-xl">
                                <FaInfoCircle className="text-yellow-500" /> Egyéb információk
                            </h3>
                            <p className={textSecondary}>
                                {animal.egyeb_info || animal.egyeb_infok || "Nincs"}
                            </p>
                        </div>
                    </div>

                    {/* Admin-specifikus információk */}
                    {animal.approved !== undefined && (
                        <div className={`${cardBg} p-5 rounded-xl shadow-md`}>
                            <h3 className="font-semibold flex items-center gap-2 text-xl mb-4">
                                <FaUserShield className="text-blue-500" /> Admin információk
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <strong>Státusz:</strong>
                                    {animal.approved ? (
                                        <span className="flex items-center gap-1 text-green-600">
                                            <FaCheck /> Jóváhagyva
                                        </span>
                                    ) : animal.rejected ? (
                                        <span className="flex items-center gap-1 text-red-600">
                                            <FaTimesIcon /> Elutasítva
                                        </span>
                                    ) : (
                                        <span className="text-yellow-600">Jóváhagyásra vár</span>
                                    )}
                                </div>

                                {animal.rejectionReasons?.length > 0 && (
                                    <div className={`mt-4 p-3 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-red-50"}`}>
                                        <h4 className="font-semibold mb-2">Elutasítási okok:</h4>
                                        <ul className="space-y-2">
                                            {animal.rejectionReasons.map((reason, index) => (
                                                <li key={index} className="text-sm">
                                                    <p><strong>{reason.reason}</strong></p>
                                                    {reason.message && <p className="italic">{reason.message}</p>}
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(reason.date).toLocaleString()} - {reason.admin}
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Modal>
    );
};

export default AnimalDetailsModal;
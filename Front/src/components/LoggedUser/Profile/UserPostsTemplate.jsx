import React, { useState, useContext } from 'react';
import { useTheme } from "../../../context/ThemeContext";
import { FaPaw, FaCalendarAlt, FaMapMarkerAlt, FaInfoCircle, FaRuler } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmationModal from './ComfirmationModal'; // Megerősítés modal
import EditAnimalModal from './EditAnimalModal'; // Szerkesztő modal
import UserContext from '../../../context/UserContext';

const UserPostsTemplate = ({ animal, onUpdate }) => {
    const { theme } = useTheme();
    const { SetRefresh } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [visszajelzes, setVisszajelzes] = useState("");

    const updatelosttofound = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('usertoken');
            const response = await fetch(`http://localhost:8000/felhasznalok/losttofound/${animal.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ visszajelzes })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Hiba történt a frissítés során");
            }

            // Modal bezárása
            setShowConfirmation(false);
            setIsLoading(false);

            // Sikeres értesítés
            toast.success("Állat sikeresen megjelölve megtaláltként!", {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: theme === "dark" ? "dark" : "light"
            });

            // Adatok frissítése
            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            toast.error(error.message, {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: theme === "dark" ? "dark" : "light"
            });
            setIsLoading(false);
            setShowConfirmation(false);
        }
    };

    const handleConfirm = () => {
        setShowConfirmation(true);
    };

    const handleEdit = () => {
        setShowEditModal(true);
    };

    const handleEditComplete = (updatedAnimal) => {
        // Modal bezárása
        setShowEditModal(false);

        // Adatok frissítése
        if (typeof onUpdate === 'function') {
            onUpdate(updatedAnimal);
        }
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                pauseOnHover={false}
                draggable
                theme={theme === "dark" ? "dark" : "light"}
                style={{ zIndex: 9999 }}
            />
            <div className={`h-full flex flex-col ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl`}>
                {/* Kép rész */}
                <div className="h-48 w-full overflow-hidden relative">
                    {animal.filePath ? (
                        <img
                            src={`http://localhost:8000/${animal.filePath}`}
                            alt={animal.allatfaj}
                            className="w-full h-full object-cover object-[center_top]"
                            style={{ objectPosition: "center 30%" }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '';
                            }}
                        />
                    ) : (
                        <div className={`w-full h-full flex items-center justify-center ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
                            <FaPaw className={`text-4xl ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`} />
                        </div>
                    )}
                </div>

                {/* Tartalom rész */}
                <div className="flex-grow p-6 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>{animal.allatfaj}</h2>
                            <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{animal.kategoria}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${animal.visszakerult_e === "true"
                                ? "bg-green-100 text-green-800"
                                : animal.elutasitva === ""
                                    ? "bg-yellow-100 text-yellow-800"
                                    : animal.elutasitva === "true"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-blue-100 text-blue-800"
                            }`}>
                            {animal.visszakerult_e === "true"
                                ? "Megtalálva"
                                : animal.elutasitva === ""
                                    ? "Jóváhagyásra vár"
                                    : animal.elutasitva === "true"
                                        ? "Elutasítva"
                                        : "Keresés alatt"}
                        </span>
                    </div>

                    <div className="flex-grow">
                        <div className={`grid grid-cols-2 gap-3 mb-4 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                            <div>
                                <p><strong>Dátum:</strong> {animal.elveszesIdeje}</p>
                                <p><strong>Nem:</strong> {animal.neme}</p>
                            </div>
                            <div>
                                <p><strong>Szín:</strong> {animal.szin}</p>
                                <p><strong>Helyszín:</strong> {animal.helyszin}</p>
                            </div>
                        </div>

                        {animal.egyeb_info && (
                            <div className={`mb-4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"} p-3 rounded-lg`}>
                                <p className="text-sm font-medium mb-1">Egyéb információk:</p>
                                <p className={`text-xs ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>{animal.egyeb_info}</p>
                            </div>
                        )}
                    </div>

                    {/* Funkciógombok */}
                    <div className="flex flex-col gap-2 mt-4">
                        {animal.visszakerult_e !== "true" && (
                            <button
                                onClick={handleConfirm}
                                disabled={isLoading}
                                className={`w-full py-2 px-4 rounded-lg font-medium ${theme === "dark"
                                        ? "bg-green-600 hover:bg-green-700 text-white"
                                        : "bg-green-500 hover:bg-green-600 text-white"
                                    } transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? 'Feldolgozás...' : 'Megjelölés megtaláltként'}
                            </button>
                        )}
                        {animal.visszakerult_e !== "true" && (
                            <button
                                onClick={handleEdit}
                                className={`w-full py-2 px-4 rounded-lg font-medium ${theme === "dark"
                                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                                        : "bg-blue-500 hover:bg-blue-600 text-white"
                                    } transition duration-300`}
                            >
                                Szerkesztés
                            </button>
                        )}
                    </div>
                </div>

                {/* Megerősítő modal */}
                {showConfirmation && (
                    <ConfirmationModal
                        title="Biztos, hogy megtaláltad?"
                        message={`Valóban megtaláltad ${animal.allatfaj} nevű állatodat? Ez a művelet nem vonható vissza.`}
                        onConfirm={updatelosttofound}
                        onCancel={() => setShowConfirmation(false)}
                        theme={theme}
                        visszajelzes={visszajelzes}
                        setVisszajelzes={setVisszajelzes}
                    />
                )}

                {/* Szerkesztő modal */}
                {showEditModal && (
                    <EditAnimalModal
                        animal={animal}
                        onClose={() => setShowEditModal(false)}
                        onUpdate={handleEditComplete}
                        theme={theme}
                    />
                )}
            </div>
        </>
    );
};

export default UserPostsTemplate;
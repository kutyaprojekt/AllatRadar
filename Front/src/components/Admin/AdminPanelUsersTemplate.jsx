import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPanelUsersTemplate = ({ user, onShowModal }) => {
    // Felhasználói adatok
    const modalId = `my_modal_${user.id}`;
    const [email, setEmail] = useState(user.email);
    const [username, setUsername] = useState(user.username);
    const [password, setPassword] = useState('');
    const [showPasswordField, setShowPasswordField] = useState(false);

    // Email cím kezelése
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    // Felhasználónév kezelése
    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    // Jelszó kezelése
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    // Adatok mentése
    const handleSubmit = async () => {
        try {
            const response = await fetch(`http://localhost:8000/felhasznalok/${user.id}/update`, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ email, username, password }),
            });

            if (response.ok) {
                toast.success("Felhasználó adatai sikeresen frissítve!");
            } else {
                toast.error("Hiba történt a mentés során");
            }
        } catch (error) {
            toast.error("Hiba történt a mentés során: " + error.message);
        }
    };

    return (
        <div className="rounded-xl bg-white shadow-xl w-96">
            <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{user.username}</h2>
                <p className="text-gray-600 mb-4">{user.email}</p>

                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    onClick={() => onShowModal(modalId)}
                >
                    Szerkesztés
                </button>

                <dialog id={modalId} className="modal">
                    <div className="bg-white rounded-lg p-6 shadow-xl max-w-md mx-auto">
                        <h3 className="text-xl font-bold mb-4">{user.username} adatai</h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                E-mail cím
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={email}
                                onChange={handleEmailChange}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Felhasználónév
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={username}
                                onChange={handleUsernameChange}
                            />
                        </div>

                        {showPasswordField && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Új jelszó
                                </label>
                                <input
                                    type="password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                            </div>
                        )}

                        <button
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 mb-4 px-3 py-1 border border-blue-500 rounded-md"
                            onClick={() => setShowPasswordField(!showPasswordField)}
                        >
                            {showPasswordField ? "Jelszó mező elrejtése" : "Jelszó módosítása"}
                        </button>

                        <div className="flex justify-end gap-3 mt-6">
                            <form method="dialog">
                                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                                    Bezárás
                                </button>
                            </form>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                onClick={handleSubmit}
                            >
                                Mentés
                            </button>
                        </div>
                    </div>
                </dialog>
            </div>
            <ToastContainer 
                position="top-right"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                pauseOnHover={false}
                draggable={false}
                transition={false}
            />

            <ToastContainer 
                position="top-right"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                pauseOnHover={false}
                draggable={false}
                closeButton={true}
            />
        </div>
    );
};

export default AdminPanelUsersTemplate;
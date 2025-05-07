import React, { useState } from 'react';
import { FaEnvelope, FaUser, FaPhone, FaKey, FaSave, FaTimes, FaUserShield } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import { useTheme } from '../../context/ThemeContext';
import 'react-toastify/dist/ReactToastify.css';

const UserEditModal = ({ user, onUpdate, onClose }) => {
    const modalId = `user-modal-${user.id}`;
    const [email, setEmail] = useState(user.email);
    const [username, setUsername] = useState(user.username);
    const [phonenumber, setPhonenumber] = useState(user.phonenumber);
    const [admin, setAdmin] = useState(user.admin);
    const [password, setPassword] = useState('');
    const [showPasswordField, setShowPasswordField] = useState(false);
    const { theme } = useTheme();
    const token = localStorage.getItem("usertoken");

    // Form mezők kezelése
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePhoneNumberChange = (e) => setPhonenumber(e.target.value);
    const handleAdminChange = (e) => setAdmin(e.target.value === 'true');
    const handlePasswordChange = (e) => setPassword(e.target.value);

    // Felhasználó frissítése
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!token) {
                toast.error("Nincs bejelentkezve! Kérjük, jelentkezzen be újra.");
                return;
            }

            const updateData = {
                email,
                username,
                phonenumber,
                admin: admin ? 'true' : 'false',
            };

            if (password) {
                updateData.password = password;
            }

            const response = await fetch(`http://localhost:8000/felhasznalok/${user.id}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                toast.success("Felhasználó adatai sikeresen frissítve!", {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true
                });
                document.getElementById(modalId).close();
                onUpdate();
                setPassword('');
                setShowPasswordField(false);
            } else {
                const errorText = await response.text();
                toast.error("Hiba történt a mentés során: " + errorText, {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true
                });
            }
        } catch (error) {
            toast.error("Hiba történt a mentés során: " + error.message, {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true
            });
        }
    };

    // Modális bezárása
    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            document.getElementById(modalId).close();
        }
    };

    return (
        <dialog id={modalId} className="modal">
            <div className={`modal-box max-w-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} relative z-40`}>
                <h3 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>
                    Felhasználó szerkesztése
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            <FaEnvelope className="w-4 h-4" />
                            E-mail cím
                        </label>
                        <input
                            type="email"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:outline-none ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                : 'bg-white border-gray-300 text-[#073F48] focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                }`}
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                    </div>

                    <div>
                        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            <FaUser className="w-4 h-4" />
                            Felhasználónév
                        </label>
                        <input
                            type="text"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:outline-none ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                : 'bg-white border-gray-300 text-[#073F48] focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                }`}
                            value={username}
                            onChange={handleUsernameChange}
                            required
                        />
                    </div>

                    <div>
                        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            <FaPhone className="w-4 h-4" />
                            Telefonszám
                        </label>
                        <input
                            type="tel"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:outline-none ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                : 'bg-white border-gray-300 text-[#073F48] focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                }`}
                            value={phonenumber}
                            onChange={handlePhoneNumberChange}
                        />
                    </div>

                    <div>
                        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            <FaUserShield className="w-4 h-4" />
                            Admin jogosultság
                        </label>
                        <select
                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:outline-none ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                : 'bg-white border-gray-300 text-[#073F48] focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                }`}
                            value={admin ? 'true' : 'false'}
                            onChange={handleAdminChange}
                        >
                            <option value="true">Igen</option>
                            <option value="false">Nem</option>
                        </select>
                    </div>

                    <div>
                        <button
                            type="button"
                            onClick={() => setShowPasswordField(!showPasswordField)}
                            className={`w-full px-4 py-2.5 border rounded-lg font-medium transition-colors ${theme === 'dark'
                                ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
                                : 'border-gray-300 hover:bg-gray-50 text-gray-600'
                                }`}
                        >
                            <FaKey className="inline-block mr-2" />
                            {showPasswordField ? "Jelszó mező elrejtése" : "Jelszó módosítása"}
                        </button>
                    </div>

                    {showPasswordField && (
                        <div>
                            <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                <FaKey className="w-4 h-4" />
                                Új jelszó
                            </label>
                            <input
                                type="password"
                                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:outline-none ${theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                    : 'bg-white border-gray-300 text-[#073F48] focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                    }`}
                                value={password}
                                onChange={handlePasswordChange}
                                minLength={6}
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${theme === 'dark'
                                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                                }`}
                        >
                            <FaTimes className="inline-block mr-2" />
                            Mégse
                        </button>
                        <button
                            type="submit"
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${theme === 'dark'
                                ? 'bg-[#1A73E8] hover:bg-[#1557B0] text-white'
                                : 'bg-[#1A73E8] hover:bg-[#1557B0] text-white'
                                }`}
                        >
                            <FaSave className="inline-block mr-2" />
                            Mentés
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
};

export default UserEditModal;
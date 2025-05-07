import React, { useEffect, useState, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { FaUser, FaUserShield, FaEnvelope, FaPhoneAlt, FaUserEdit, FaTrashAlt, FaSearch } from 'react-icons/fa';
import UserContext from '../../context/UserContext';
import UserEditModal from './UserEditModal';
import { useTheme } from '../../context/ThemeContext';
import SideBarMenu from '../Assets/SidebarMenu/SideBarMenu';
import 'react-toastify/dist/ReactToastify.css';

const AdminPanelUsers = () => {
    // Alapállapotok
    const [adatok, setAdatok] = useState({ animals: [], users: [] });
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('felhasznalok');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // Autentikáció és kontextus
    const token = localStorage.getItem("usertoken");
    const { user } = useContext(UserContext);
    const { theme } = useTheme();
    const isAdmin = user?.admin === "true";

    // Adatok betöltése
    const loadAdatok = async () => {
        try {
            if (!token) {
                throw new Error("Nincs token! Jelentkezz be.");
            }

            const response = await fetch("http://localhost:8000/felhasznalok/adminusers", {
                method: 'GET',
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Hiba történt az adatok lekérése során");
            }

            const data = await response.json();
            setAdatok(data || { animals: [], users: [] });
        } catch (error) {
            setAdatok({ animals: [], users: [] });
        }
    };

    // Komponens betöltése
    useEffect(() => {
        loadAdatok();
        window.scrollTo(0, 0);
    }, []);

    // Felhasználó törlése
    const handleDeleteUser = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8000/felhasznalok/${userId}`, {
                method: 'DELETE',
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                await response.json();
                toast.success("Felhasználó törölve!");
                loadAdatok();
            } else {
                const errorText = await response.text();
                toast.error("Hiba történt a törlés során: " + errorText);
            }
        } catch (error) {
            toast.error("Hiba történt a törlés során: " + error.message);
        }
    };

    // Szerkesztő modal megnyitása
    const handleOpenModal = (modalId) => {
        document.getElementById(modalId).showModal();
    };

    // Törlés modal megnyitása
    const openDeleteModal = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    // Törlés modal bezárása
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setUserToDelete(null);
    };

    // Felhasználók szűrése
    const filteredUsers = adatok.users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-b from-[#f0fdff] to-[#e0e3fe]'}`}>
            <ToastContainer 
                position="top-right"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                className="z-50"
            />
            <div className="container mx-auto px-4 pt-24 pb-12 flex flex-col md:flex-row gap-8">
                <SideBarMenu
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isAdmin={isAdmin}
                />
                <div className={`flex-1 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 md:p-8`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                        <h2 className={`text-2xl font-bold flex items-center ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'} mb-4 md:mb-0`}>
                            <FaUserShield className="w-6 h-6 mr-3 text-[#1A73E8]" />
                            Felhasználók kezelése
                        </h2>

                        <div className="relative w-full md:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                            </div>
                            <input
                                type="text"
                                placeholder="Keresés..."
                                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:outline-none ${theme === 'dark'
                                        ? 'bg-gray-700 text-white border-gray-600 focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                        : 'bg-white text-[#073F48] border-gray-300 focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                    }`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} text-left`}>
                                <tr>
                                    <th className="py-3 px-4 font-medium rounded-tl-lg">
                                        <span className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                            <FaUser className="mr-2" />
                                            Felhasználónév
                                        </span>
                                    </th>
                                    <th className="py-3 px-4 font-medium hidden md:table-cell">
                                        <span className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                            <FaEnvelope className="mr-2" />
                                            E-mail
                                        </span>
                                    </th>
                                    <th className="py-3 px-4 font-medium hidden lg:table-cell">
                                        <span className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                            <FaPhoneAlt className="mr-2" />
                                            Telefonszám
                                        </span>
                                    </th>
                                    <th className="py-3 px-4 font-medium hidden sm:table-cell">
                                        <span className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                            <FaUserShield className="mr-2" />
                                            Admin
                                        </span>
                                    </th>
                                    <th className="py-3 px-4 font-medium rounded-tr-lg text-right">
                                        <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Műveletek
                                        </span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className={`border-b ${theme === 'dark'
                                            ? 'border-gray-700 hover:bg-gray-700/80'
                                            : 'border-gray-200 hover:bg-gray-50'
                                        }`}>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                                                    }`}>
                                                    <FaUser className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} />
                                                </div>
                                                <span className={`${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>
                                                    {user.username}
                                                </span>
                                            </div>
                                        </td>
                                        <td className={`py-4 px-4 hidden md:table-cell ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {user.email}
                                        </td>
                                        <td className={`py-4 px-4 hidden lg:table-cell ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {user.phonenumber || '-'}
                                        </td>
                                        <td className="py-4 px-4 hidden sm:table-cell">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user.admin === "true"
                                                    ? theme === 'dark'
                                                        ? 'bg-green-900/30 text-green-400'
                                                        : 'bg-green-100 text-green-800'
                                                    : theme === 'dark'
                                                        ? 'bg-gray-700 text-gray-400'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {user.admin === "true" ? "Igen" : "Nem"}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => handleOpenModal(`user-modal-${user.id}`)}
                                                    className={`p-2 rounded-lg transition-colors ${theme === 'dark'
                                                            ? 'bg-[#1A73E8] hover:bg-[#1557B0] text-white'
                                                            : 'bg-[#1A73E8] hover:bg-[#1557B0] text-white'
                                                        }`}
                                                    title="Szerkesztés"
                                                >
                                                    <FaUserEdit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(user)}
                                                    className={`p-2 rounded-lg transition-colors ${theme === 'dark'
                                                            ? 'bg-red-900/20 hover:bg-red-900/30 text-red-400'
                                                            : 'bg-red-100 hover:bg-red-200 text-red-600'
                                                        }`}
                                                    title="Törlés"
                                                >
                                                    <FaTrashAlt className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <UserEditModal 
                                                user={user} 
                                                onUpdate={loadAdatok} 
                                                onClose={() => document.getElementById(`user-modal-${user.id}`).close()}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredUsers.length === 0 && (
                        <div className={`py-12 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Nincs megjeleníthető felhasználó
                        </div>
                    )}
                </div>
            </div>

            <dialog id="delete-modal" className={`modal ${showDeleteModal ? 'modal-open' : ''}`}>
                <div className={`modal-box ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                    <h3 className="font-bold text-lg mb-4">Felhasználó törlése</h3>
                    <p className="mb-6">Biztosan törölni szeretnéd a(z) <span className="font-semibold">{userToDelete?.username}</span> felhasználót?</p>
                    <div className="modal-action">
                        <button
                            onClick={closeDeleteModal}
                            className={`btn ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                            Mégse
                        </button>
                        <button
                            onClick={() => {
                                handleDeleteUser(userToDelete?.id);
                                closeDeleteModal();
                            }}
                            className="btn bg-red-500 hover:bg-red-600 text-white"
                        >
                            Törlés
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default AdminPanelUsers;
import React from 'react';
import { FaUser, FaPaw, FaList, FaCog, FaSignOutAlt, FaUserShield } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';

const SideBarMenu = ({ activeTab, setActiveTab, isAdmin }) => {
    const { theme } = useTheme();

    const menuItems = [
        { id: 'profile', label: 'Profilom', icon: <FaUser /> },
        { id: 'myPets', label: 'Kisállataim', icon: <FaPaw /> },
        { id: 'myPosts', label: 'Posztjaim', icon: <FaList /> },
        ...(isAdmin ? [{ id: 'admin', label: 'Admin', icon: <FaUserShield /> }] : []),
        { id: 'settings', label: 'Beállítások', icon: <FaCog /> },
        { id: 'logout', label: 'Kijelentkezés', icon: <FaSignOutAlt /> }
    ];

    return (
        <div className={`rounded-xl shadow-lg overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-4">
                <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>
                    Menü
                </h3>
                <nav className="space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                                activeTab === item.id
                                    ? theme === 'dark'
                                        ? 'bg-[#1A73E8] text-white'
                                        : 'bg-[#1A73E8] text-white'
                                    : theme === 'dark'
                                        ? 'text-gray-300 hover:bg-gray-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <span className="mr-3">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default SideBarMenu; 
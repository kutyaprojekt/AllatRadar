import React, { useState } from 'react';
import { FaCog, FaMoon, FaSun, FaBell, FaLanguage } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';

const Settings = () => {
    const { theme, toggleTheme } = useTheme();
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        sms: false
    });
    const [language, setLanguage] = useState('hu');

    const handleNotificationChange = (type) => {
        setNotifications(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#F0F4F8]'}`}>
            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-4 md:p-8`}>
                    <div className="flex items-center mb-6 md:mb-10">
                        <h2 className={`text-xl md:text-2xl font-bold flex items-center ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>
                            <FaCog className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-[#1A73E8]" />
                            Beállítások
                        </h2>
                    </div>

                    <div className="space-y-8">
                        {/* Téma beállítások */}
                        <div className={`p-4 md:p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <h3 className={`text-lg font-semibold mb-4 flex items-center ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>
                                <FaMoon className="w-5 h-5 mr-2 text-[#1A73E8]" />
                                Téma
                            </h3>
                            <div className="flex items-center justify-between">
                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {theme === 'dark' ? 'Sötét téma' : 'Világos téma'}
                                </span>
                                <button
                                    onClick={toggleTheme}
                                    className={`p-2 rounded-lg transition-colors ${
                                        theme === 'dark' 
                                            ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                                            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                                    }`}
                                >
                                    {theme === 'dark' ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Értesítések */}
                        <div className={`p-4 md:p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <h3 className={`text-lg font-semibold mb-4 flex items-center ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>
                                <FaBell className="w-5 h-5 mr-2 text-[#1A73E8]" />
                                Értesítések
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Email értesítések
                                    </span>
                                    <button
                                        onClick={() => handleNotificationChange('email')}
                                        className={`w-12 h-6 rounded-full transition-colors ${
                                            notifications.email
                                                ? theme === 'dark'
                                                    ? 'bg-[#1A73E8]'
                                                    : 'bg-[#1A73E8]'
                                                : theme === 'dark'
                                                    ? 'bg-gray-600'
                                                    : 'bg-gray-300'
                                        }`}
                                    >
                                        <div
                                            className={`w-5 h-5 rounded-full bg-white transition-transform ${
                                                notifications.email ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Push értesítések
                                    </span>
                                    <button
                                        onClick={() => handleNotificationChange('push')}
                                        className={`w-12 h-6 rounded-full transition-colors ${
                                            notifications.push
                                                ? theme === 'dark'
                                                    ? 'bg-[#1A73E8]'
                                                    : 'bg-[#1A73E8]'
                                                : theme === 'dark'
                                                    ? 'bg-gray-600'
                                                    : 'bg-gray-300'
                                        }`}
                                    >
                                        <div
                                            className={`w-5 h-5 rounded-full bg-white transition-transform ${
                                                notifications.push ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        SMS értesítések
                                    </span>
                                    <button
                                        onClick={() => handleNotificationChange('sms')}
                                        className={`w-12 h-6 rounded-full transition-colors ${
                                            notifications.sms
                                                ? theme === 'dark'
                                                    ? 'bg-[#1A73E8]'
                                                    : 'bg-[#1A73E8]'
                                                : theme === 'dark'
                                                    ? 'bg-gray-600'
                                                    : 'bg-gray-300'
                                        }`}
                                    >
                                        <div
                                            className={`w-5 h-5 rounded-full bg-white transition-transform ${
                                                notifications.sms ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Nyelv beállítások */}
                        <div className={`p-4 md:p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <h3 className={`text-lg font-semibold mb-4 flex items-center ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>
                                <FaLanguage className="w-5 h-5 mr-2 text-[#1A73E8]" />
                                Nyelv
                            </h3>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none ${
                                    theme === 'dark' 
                                        ? 'border-gray-600 bg-gray-700 text-white focus:ring-[#1A73E8] focus:border-[#1A73E8]' 
                                        : 'border-gray-300 bg-white text-[#073F48] focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                }`}
                            >
                                <option value="hu">Magyar</option>
                                <option value="en">English</option>
                                <option value="de">Deutsch</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings; 
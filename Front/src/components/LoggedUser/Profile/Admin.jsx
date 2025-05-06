import React, { useState, useEffect } from 'react';
import { FaUserShield, FaUser, FaTrash, FaBan, FaCheck } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';

const Admin = () => {
    const { theme } = useTheme();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const [actionType, setActionType] = useState('');

    useEffect(() => {
        // TODO: Fetch users from API
        // This is just mock data for now
        setUsers([
            {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                role: 'user',
                status: 'active',
                createdAt: '2024-01-01'
            },
            {
                id: 2,
                name: 'Jane Smith',
                email: 'jane@example.com',
                role: 'admin',
                status: 'active',
                createdAt: '2024-01-02'
            }
        ]);
    }, []);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAction = (user, type) => {
        setSelectedUser(user);
        setActionType(type);
        setIsConfirming(true);
    };

    const confirmAction = () => {
        // TODO: Perform action via API
        if (actionType === 'delete') {
            setUsers(users.filter(user => user.id !== selectedUser.id));
        } else if (actionType === 'ban') {
            setUsers(users.map(user =>
                user.id === selectedUser.id
                    ? { ...user, status: user.status === 'active' ? 'banned' : 'active' }
                    : user
            ));
        }
        setIsConfirming(false);
        setSelectedUser(null);
        setActionType('');
    };

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#F0F4F8]'}`}>
            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-4 md:p-8`}>
                    <div className="flex items-center justify-between mb-6 md:mb-10">
                        <h2 className={`text-xl md:text-2xl font-bold flex items-center ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>
                            <FaUserShield className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-[#1A73E8]" />
                            Admin felület
                        </h2>
                    </div>

                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Keresés név vagy email alapján..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none ${
                                theme === 'dark' 
                                    ? 'border-gray-600 bg-gray-700 text-white focus:ring-[#1A73E8] focus:border-[#1A73E8]' 
                                    : 'border-gray-300 bg-white text-[#073F48] focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                            }`}
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                                    <th className={`py-3 px-4 text-left text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Felhasználó
                                    </th>
                                    <th className={`py-3 px-4 text-left text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Email
                                    </th>
                                    <th className={`py-3 px-4 text-left text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Szerepkör
                                    </th>
                                    <th className={`py-3 px-4 text-left text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Állapot
                                    </th>
                                    <th className={`py-3 px-4 text-left text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Regisztráció
                                    </th>
                                    <th className={`py-3 px-4 text-left text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Műveletek
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
                                    >
                                        <td className="py-3 px-4">
                                            <div className="flex items-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                                                }`}>
                                                    <FaUser className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
                                                </div>
                                                <span className={`ml-3 ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>
                                                    {user.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className={`py-3 px-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {user.email}
                                        </td>
                                        <td className={`py-3 px-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {user.role}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                user.status === 'active'
                                                    ? theme === 'dark'
                                                        ? 'bg-green-900/50 text-green-400'
                                                        : 'bg-green-100 text-green-800'
                                                    : theme === 'dark'
                                                        ? 'bg-red-900/50 text-red-400'
                                                        : 'bg-red-100 text-red-800'
                                            }`}>
                                                {user.status === 'active' ? 'Aktív' : 'Letiltva'}
                                            </span>
                                        </td>
                                        <td className={`py-3 px-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {user.createdAt}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleAction(user, 'ban')}
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        theme === 'dark' 
                                                            ? 'text-yellow-400 hover:bg-gray-700' 
                                                            : 'text-yellow-600 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <FaBan className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleAction(user, 'delete')}
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        theme === 'dark' 
                                                            ? 'text-red-400 hover:bg-gray-700' 
                                                            : 'text-red-600 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <FaTrash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Megerősítő modal */}
                    {isConfirming && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                            <div className={`rounded-lg p-6 max-w-md w-full ${
                                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                            }`}>
                                <h3 className={`text-lg font-semibold mb-4 ${
                                    theme === 'dark' ? 'text-white' : 'text-[#073F48]'
                                }`}>
                                    {actionType === 'delete' ? 'Felhasználó törlése' : 'Felhasználó letiltása/engedélyezése'}
                                </h3>
                                <p className={`mb-6 ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                    {actionType === 'delete'
                                        ? `Biztosan törölni szeretnéd a(z) ${selectedUser?.name} felhasználót?`
                                        : `Biztosan ${selectedUser?.status === 'active' ? 'letiltani' : 'engedélyezni'} szeretnéd a(z) ${selectedUser?.name} felhasználót?`}
                                </p>
                                <div className="flex flex-col md:flex-row gap-3">
                                    <button
                                        onClick={confirmAction}
                                        className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                                            theme === 'dark' 
                                                ? 'bg-[#1A73E8] hover:bg-[#1557B0] text-white' 
                                                : 'bg-[#1A73E8] hover:bg-[#1557B0] text-white'
                                        }`}
                                    >
                                        <FaCheck className="w-4 h-4 inline-block mr-2" />
                                        Megerősítés
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsConfirming(false);
                                            setSelectedUser(null);
                                            setActionType('');
                                        }}
                                        className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                                            theme === 'dark' 
                                                ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                                                : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                                        }`}
                                    >
                                        Mégse
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Admin; 
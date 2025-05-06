import React, { useState, useEffect, useContext } from 'react';
import { 
  FaUser,         
  FaNewspaper,   
  FaEnvelope,    
  FaClipboardList, 
  FaUsers,
  FaCog,
  FaChevronDown,
  FaChevronUp         
} from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from "../../../context/ThemeContext";
import NotificationBadge from '../../Assets/NotificationBadge';
import UserContext from "../../../context/UserContext";

const SideBarMenu = ({ isAdmin = false, activeTab, setActiveTab }) => {
    const { theme } = useTheme();
    const location = useLocation();
    const [rejectedCount, setRejectedCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const token = localStorage.getItem("usertoken");
    const { refresh } = useContext(UserContext);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getCurrentTab = () => {
        const path = location.pathname;
        if (path.includes('/profilom')) return 'profilom';
        if (path.includes('/posztjaim')) return 'posztjaim';
        if (path.includes('/uzenetek')) return 'uzenetek';
        if (path.includes('/adminposts')) return 'bejegyzesek';
        if (path.includes('/adminusers')) return 'felhasznalok';
        return '';
    };

    const currentTab = activeTab || getCurrentTab();

    useEffect(() => {
        const checkRejectedPosts = async () => {
            try {
                const response = await fetch('http://localhost:8000/felhasznalok/rejected-posts', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setRejectedCount(data.length);
                }
            } catch (error) {
                console.error('Error checking rejected posts:', error);
            }
        };

        const checkPendingPosts = async () => {
            // Csak akkor ellenőrizzük a jóváhagyásra váró posztokat, ha admin a felhasználó
            if (!isAdmin) {
                setPendingCount(0);
                return;
            }
            
            try {
                const response = await fetch('http://localhost:8000/felhasznalok/pending-posts', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setPendingCount(data.length);
                }
            } catch (error) {
                console.error('Error checking pending posts:', error);
            }
        };

        // Elutasított és függő posztok ellenőrzése
        const checkNotifications = () => {
            checkRejectedPosts();
            checkPendingPosts();
        };
        
        if (token) {
            checkNotifications();
        }
        
        // 10 másodpercenként frissítjük az értesítéseket
        const intervalId = setInterval(() => {
            if (token) {
                checkNotifications();
            }
        }, 10000);
        
        // Intervallum törlése komponens unmountoláskor
        return () => clearInterval(intervalId);
    }, [token, refresh, isAdmin]);

    // Admin státusz változásakor frissítés
    useEffect(() => {
        const checkPendingPosts = async () => {
            if (!isAdmin || !token) return;
            
            try {
                const response = await fetch('http://localhost:8000/felhasznalok/pending-posts', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setPendingCount(data.length);
                }
            } catch (error) {
                console.error('Error in admin pending posts check:', error);
            }
        };
        
        checkPendingPosts();
    }, [isAdmin, token]);

    const handleLinkClick = () => {
        if (isMobile) {
            setIsMobileMenuOpen(false);
        }
        if (setActiveTab) {
            setActiveTab(getCurrentTab());
        }
    };

    // Mobilnézet
    if (isMobile) {
        return (
            <div className="mb-6">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className={`w-full flex items-center justify-between px-4 py-3 ${
                        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                    } rounded-lg shadow-md mb-1`}
                >
                    <span className="font-semibold">Menü</span>
                    {isMobileMenuOpen ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {isMobileMenuOpen && (
                    <div className={`${
                        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                    } rounded-lg shadow-md p-4 space-y-2`}>
                        <Link
                            to="/profilom"
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                                currentTab === 'profilom'
                                    ? theme === 'dark' 
                                        ? 'bg-gray-700 text-white' 
                                        : 'bg-[#1A73E8] text-white'
                                    : theme === 'dark' 
                                        ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            onClick={handleLinkClick}
                        >
                            <FaUser className="mr-3 text-lg" />
                            <span className="font-medium">Profilom</span>
                        </Link>
                        <Link
                            to="/posztjaim"
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors relative ${
                                currentTab === 'posztjaim'
                                    ? theme === 'dark' 
                                        ? 'bg-gray-700 text-white' 
                                        : 'bg-[#1A73E8] text-white'
                                    : theme === 'dark' 
                                        ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            onClick={handleLinkClick}
                        >
                            <FaNewspaper className="mr-3 text-lg" />
                            <span className="font-medium">Posztjaim</span>
                        </Link>

                        <Link
                            to="/uzenetek"
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors relative ${
                                currentTab === 'uzenetek'
                                    ? theme === 'dark' 
                                        ? 'bg-gray-700 text-white' 
                                        : 'bg-[#1A73E8] text-white'
                                    : theme === 'dark' 
                                        ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            onClick={handleLinkClick}
                        >
                            <FaEnvelope className="mr-3 text-lg" />
                            <span className="font-medium">Üzenetek</span>
                            {rejectedCount > 0 && (
                                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                                    {rejectedCount}
                                </span>
                            )}
                        </Link>
                        
                        {isAdmin && (
                            <>
                                <div className={`mt-4 pt-4 border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                                    <h3 className={`text-lg font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'} px-4`}>
                                        Admin Panel
                                    </h3>
                                    
                                    <Link
                                        to="/adminposts"
                                        className={`flex items-center px-4 py-3 rounded-lg transition-colors relative ${
                                            currentTab === 'bejegyzesek'
                                                ? theme === 'dark' 
                                                    ? 'bg-gray-700 text-white' 
                                                    : 'bg-[#1A73E8] text-white'
                                                : theme === 'dark' 
                                                    ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' 
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                        onClick={handleLinkClick}
                                    >
                                        <FaClipboardList className="mr-3 text-lg" />
                                        <span className="font-medium">Bejegyzések</span>
                                        {pendingCount > 0 && (
                                            <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                                                {pendingCount}
                                            </span>
                                        )}
                                    </Link>
                                    
                                    <Link
                                        to="/adminusers"
                                        className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                                            currentTab === 'felhasznalok'
                                                ? theme === 'dark' 
                                                    ? 'bg-gray-700 text-white' 
                                                    : 'bg-[#1A73E8] text-white'
                                                : theme === 'dark' 
                                                    ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' 
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                        onClick={handleLinkClick}
                                    >
                                        <FaUsers className="mr-3 text-lg" />
                                        <span className="font-medium">Felhasználók</span>
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // Asztali nézet
    return (
        <aside className={`w-64 flex-shrink-0 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-[#073F48]'} rounded-xl shadow-lg p-6 h-fit sticky top-24`}>
            <h2 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>Felhasználói Panel</h2>
            <nav className="space-y-3">
                <Link
                    to="/profilom"
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                        currentTab === 'profilom'
                            ? theme === 'dark' 
                                ? 'bg-gray-700 text-white' 
                                : 'bg-[#1A73E8] text-white'
                            : theme === 'dark' 
                                ? 'hover:bg-gray-700' 
                                : 'hover:bg-gray-100'
                    }`}
                    onClick={handleLinkClick}
                >
                    <FaUser className="mr-3 text-lg" />
                    <span className="font-medium">Profilom</span>
                </Link>
                
                <Link
                    to="/posztjaim"
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors relative ${
                        currentTab === 'posztjaim'
                            ? theme === 'dark' 
                                ? 'bg-gray-700 text-white' 
                                : 'bg-[#1A73E8] text-white'
                            : theme === 'dark' 
                                ? 'hover:bg-gray-700' 
                                : 'hover:bg-gray-100'
                    }`}
                    onClick={handleLinkClick}
                >
                    <FaNewspaper className="mr-3 text-lg" />
                    <span className="font-medium">Posztjaim</span>
                </Link>
                
                <Link
                    to="/uzenetek"
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors relative ${
                        currentTab === 'uzenetek'
                            ? theme === 'dark' 
                                ? 'bg-gray-700 text-white' 
                                : 'bg-[#1A73E8] text-white'
                            : theme === 'dark' 
                                ? 'hover:bg-gray-700' 
                                : 'hover:bg-gray-100'
                    }`}
                    onClick={handleLinkClick}
                >
                    <FaEnvelope className="mr-3 text-lg" />
                    <span className="font-medium">Üzenetek</span>
                    {rejectedCount > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                            {rejectedCount}
                        </span>
                    )}
                </Link>
            </nav>
            
            {isAdmin && (
                <>
                    <h2 className={`text-xl font-bold my-6 ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>Admin Panel</h2>
                    <nav className="space-y-3">
                        <Link
                            to="/adminposts"
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors relative ${
                                currentTab === 'bejegyzesek'
                                    ? theme === 'dark' 
                                        ? 'bg-gray-700 text-white' 
                                        : 'bg-[#1A73E8] text-white'
                                    : theme === 'dark' 
                                        ? 'hover:bg-gray-700' 
                                        : 'hover:bg-gray-100'
                            }`}
                            onClick={handleLinkClick}
                        >
                            <FaClipboardList className="mr-3 text-lg" />
                            <span className="font-medium">Bejegyzések</span>
                            {pendingCount > 0 && (
                                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                                    {pendingCount}
                                </span>
                            )}
                        </Link>
                        
                        <Link
                            to="/adminusers"
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                                currentTab === 'felhasznalok'
                                    ? theme === 'dark' 
                                        ? 'bg-gray-700 text-white' 
                                        : 'bg-[#1A73E8] text-white'
                                    : theme === 'dark' 
                                        ? 'hover:bg-gray-700' 
                                        : 'hover:bg-gray-100'
                            }`}
                            onClick={handleLinkClick}
                        >
                            <FaUsers className="mr-3 text-lg" />
                            <span className="font-medium">Felhasználók</span>
                        </Link>
                    </nav>
                </>
            )}
        </aside>
    );
};

export default SideBarMenu;
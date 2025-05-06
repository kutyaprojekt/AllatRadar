import React, { useEffect, useState, useContext } from 'react';
import { useTheme } from "../../../context/ThemeContext";
import UserPostsTemplate from './UserPostsTemplate';
import SideBarMenu from '../../Assets/SidebarMenu/SideBarMenu';
import { Link } from "react-router-dom";
import { FaPlus } from 'react-icons/fa';
import UserContext from '../../../context/UserContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserPosts = () => {
    const [animals, setAnimals] = useState([]);
    const [filteredAnimals, setFilteredAnimals] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const { theme } = useTheme();
    const token = localStorage.getItem("usertoken");
    const { refresh, SetRefresh } = useContext(UserContext);
    
    const [activeTab, setActiveTab] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    
    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    const adminornot = async () => {
        try {
            // Felhasználó adatainak lekérése
            const userResponse = await fetch("http://localhost:8000/felhasznalok/me", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            const userData = await userResponse.json();
            setUser(userData);

            if(userData.admin == "true") {
                setIsAdmin(true);
            }

        } catch (error) {
            console.error("Hiba a felhasználó adatok lekérésekor:", error);
        }
    };

    const loadAnimals = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:8000/felhasznalok/posztjaim", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // Sort by date, newest first
            const sortedAnimals = Array.isArray(data) 
                ? data.sort((a, b) => new Date(b.datum) - new Date(a.datum))
                : [];
            setAnimals(sortedAnimals);
        } catch (error) {
            console.error("Hiba történt az API hívás során:", error);
            setAnimals([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await adminornot();
            await loadAnimals();
        };
        
        fetchData();
    }, [refresh]);

    const handlePostUpdate = async () => {
        console.log("Frissítés kérve a UserPosts komponensben");
        
        // Közvetlenül töltjük újra az állatokat
        await loadAnimals();
        
        // Majd frissítjük a kontextust is a teljes alkalmazás frissítéséhez
        SetRefresh(prev => !prev);
    };

    useEffect(() => {
        const filtered = animals.filter(animal => {
            if (filter === 'all') return true;
            if (filter === 'found') return animal.visszakerult_e === "true";
            if (filter === 'rejected') return animal.elutasitva === "true";
            if (filter === 'pending') return animal.elutasitva === "";
            if (filter === 'searching') return animal.visszakerult_e === "false" && animal.elutasitva === "false";
            return true;
        });
        setFilteredAnimals(filtered);
    }, [animals, filter]);

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-900" : "bg-gradient-to-b from-[#f0fdff] to-[#e0e3fe]"}`}>
                <div className="text-2xl font-semibold">Betöltés...</div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gradient-to-b from-[#f0fdff] to-[#e0e3fe]"}`}>
            <ToastContainer className="z-50" />
            <div className="container mx-auto px-4 pt-24 pb-12 flex flex-col md:flex-row gap-8">
                {/* SideBarMenu komponens használata */}
                <SideBarMenu 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    isAdmin={isAdmin} 
                />

                {/* Fő tartalom */}
                <div className={`flex-1 ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-xl shadow-lg p-8`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
                        <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-[#073F48]"} mb-4 md:mb-0`}>
                            Posztjaim
                        </h1>
                        <div className="flex flex-col md:flex-row gap-4">
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className={`px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                                    theme === 'dark' 
                                        ? 'bg-gray-700 text-white border-gray-600 focus:ring-[#1A73E8] focus:border-[#1A73E8]' 
                                        : 'bg-white text-[#073F48] border-gray-300 focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                }`}
                            >
                                <option value="all">Összes</option>
                                <option value="searching">Keresés alatt</option>
                                <option value="found">Megtaláltak</option>
                                <option value="rejected">Elutasítottak</option>
                                <option value="pending">Jóváhagyásra várók</option>
                            </select>
                            <Link 
                                to="/elveszettallat" 
                                className={`flex items-center px-5 py-2.5 rounded-lg font-medium transition-colors ${
                                    theme === 'dark' 
                                        ? 'bg-[#1A73E8] hover:bg-[#1557B0] text-white' 
                                        : 'bg-[#1A73E8] hover:bg-[#1557B0] text-white'
                                }`}
                            >
                                <FaPlus className="mr-2" />
                                Új poszt
                            </Link>
                        </div>
                    </div>

                    {filteredAnimals.length === 0 ? (
                        <div className={`text-center py-16 ${theme === "dark" ? "text-gray-300" : "text-[#073F48]"}`}>
                            <p className="text-xl mb-6">Nincs megjeleníthető poszt.</p>
                            <Link 
                                to="/elveszettallat" 
                                className={`inline-block px-8 py-3 rounded-lg font-medium text-white bg-[#1A73E8] hover:bg-[#1557B0] transition-colors`}
                            >
                                Új poszt létrehozása
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                            {filteredAnimals.map((animal) => (
                                <div key={animal.id} className="h-full">
                                    <UserPostsTemplate animal={animal} onUpdate={handlePostUpdate} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserPosts;
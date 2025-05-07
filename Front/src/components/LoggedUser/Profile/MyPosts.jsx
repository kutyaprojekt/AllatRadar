import React, { useState, useEffect, useContext } from 'react';
import { FaPlus, FaEdit, FaTrash, FaList } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../../../context/UserContext';

const MyPosts = () => {
    const { theme } = useTheme();
    const { refresh, SetRefresh } = useContext(UserContext);
    const [posts, setPosts] = useState([]);
    const [isAddingPost, setIsAddingPost] = useState(false);
    const [isEditingPost, setIsEditingPost] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        date: '',
        status: 'active'
    });
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("usertoken");

    // Posztok betöltése
    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/api/posts/my-posts', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Nem sikerült betölteni a posztokat');
            }

            const data = await response.json();
            // Posztok rendezése dátum szerint (újabbak előre)
            const sortedPosts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setPosts(sortedPosts);
        } catch (error) {
            toast.error('Nem sikerült betölteni a posztokat');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [refresh]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Megtalált státusz ellenőrzése nem jóváhagyott poszt esetén
        if (name === 'status' && value === 'solved' && isEditingPost) {
            if (currentPost.elutasitva === "" || currentPost.elutasitva === "true") {
                toast.error("Csak jóváhagyott posztokat lehet megtaláltnak jelölni!");
                return;
            }
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Megtalált státusz ellenőrzése nem jóváhagyott poszt esetén
        if (isEditingPost) {
            if (formData.status === 'solved') {
                // Poszt jóváhagyási állapot ellenőrzése
                if (!currentPost || currentPost.elutasitva === "" || currentPost.elutasitva === "true") {
                    toast.error("Csak jóváhagyott posztokat lehet megtaláltnak jelölni!");
                    return;
                }
            }

            // Nem jóváhagyott poszt szerkesztési ellenőrzés
            if (!currentPost || currentPost.elutasitva === "" || currentPost.elutasitva === "true") {
                toast.error("Nem jóváhagyott poszt nem szerkeszthető!");
                return;
            }
        }

        try {
            if (isEditingPost) {
                // Poszt szerkesztése
                const response = await fetch(`http://localhost:8000/api/posts/${currentPost.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('Nem sikerült frissíteni a posztot');
                }

                toast.success("A poszt sikeresen frissítve!");
            } else {
                // Új poszt létrehozása
                const response = await fetch('http://localhost:8000/api/posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('Nem sikerült létrehozni az új posztot');
                }

                toast.success("Az új poszt sikeresen létrehozva!");
            }

            // Posztok listájának frissítése
            fetchPosts();

            // Űrlap visszaállítása
            setIsAddingPost(false);
            setIsEditingPost(false);
            setCurrentPost(null);
            setFormData({
                title: '',
                description: '',
                location: '',
                date: '',
                status: 'active'
            });

            // Felhasználói kontextus frissítése
            SetRefresh(prev => !prev);

        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleEdit = (post) => {
        // Poszt jóváhagyás ellenőrzése
        if (post.elutasitva === "" || post.elutasitva === "true") {
            toast.error("Nem módosítható olyan poszt, ami nincs jóváhagyva!");
            return;
        }

        setCurrentPost(post);
        setFormData({
            title: post.title,
            description: post.description,
            location: post.location,
            date: post.date,
            status: post.status
        });
        setIsEditingPost(true);
        setIsAddingPost(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Biztosan törölni szeretnéd ezt a posztot?')) {
            try {
                const response = await fetch(`http://localhost:8000/api/posts/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Nem sikerült törölni a posztot');
                }

                // Posztok listájának frissítése
                fetchPosts();
                toast.success("A poszt sikeresen törölve!");

                // Felhasználói kontextus frissítése
                SetRefresh(prev => !prev);

            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-b from-[#f0fdff] to-[#e0e3fe]'}`}>
            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-4 md:p-8`}>
                    <div className="flex items-center justify-between mb-6 md:mb-10">
                        <h2 className={`text-xl md:text-2xl font-bold flex items-center ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>
                            <FaList className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-[#1A73E8]" />
                            Posztjaim
                        </h2>
                        <button
                            onClick={() => setIsAddingPost(true)}
                            className={`flex items-center px-4 py-2 md:px-5 md:py-2.5 rounded-lg font-medium transition-colors ${theme === 'dark'
                                    ? 'bg-[#1A73E8] hover:bg-[#1557B0] text-white'
                                    : 'bg-[#1A73E8] hover:bg-[#1557B0] text-white'
                                }`}
                        >
                            <FaPlus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                            Új poszt
                        </button>
                    </div>

                    {isAddingPost && (
                        <div className={`mb-8 p-4 md:p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>
                                {isEditingPost ? 'Poszt szerkesztése' : 'Új poszt létrehozása'}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="title" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Cím
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none ${theme === 'dark'
                                                ? 'border-gray-600 bg-gray-700 text-white focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                                : 'border-gray-300 bg-white text-[#073F48] focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                            }`}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="description" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Leírás
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none ${theme === 'dark'
                                                ? 'border-gray-600 bg-gray-700 text-white focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                                : 'border-gray-300 bg-white text-[#073F48] focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                            }`}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="location" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Helyszín
                                        </label>
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none ${theme === 'dark'
                                                    ? 'border-gray-600 bg-gray-700 text-white focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                                    : 'border-gray-300 bg-white text-[#073F48] focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                                }`}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="date" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Dátum
                                        </label>
                                        <input
                                            type="date"
                                            id="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none ${theme === 'dark'
                                                    ? 'border-gray-600 bg-gray-700 text-white focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                                    : 'border-gray-300 bg-white text-[#073F48] focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                                }`}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="status" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Állapot
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none ${theme === 'dark'
                                                ? 'border-gray-600 bg-gray-700 text-white focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                                : 'border-gray-300 bg-white text-[#073F48] focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                            }`}
                                        required
                                    >
                                        <option value="active">Aktív</option>
                                        <option value="inactive">Inaktív</option>
                                        // Megoldva opció csak új vagy jóváhagyott poszt esetén
                                        {(!isEditingPost || (currentPost && currentPost.elutasitva === "false")) && (
                                            <option value="solved">Megoldva</option>
                                        )}
                                    </select>
                                </div>

                                <div className="flex flex-col md:flex-row gap-3">
                                    <button
                                        type="submit"
                                        className={`px-4 py-3 rounded-lg font-medium transition-colors ${theme === 'dark'
                                                ? 'bg-[#1A73E8] hover:bg-[#1557B0] text-white'
                                                : 'bg-[#1A73E8] hover:bg-[#1557B0] text-white'
                                            }`}
                                    >
                                        {isEditingPost ? 'Mentés' : 'Létrehozás'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsAddingPost(false);
                                            setIsEditingPost(false);
                                            setCurrentPost(null);
                                            setFormData({
                                                title: '',
                                                description: '',
                                                location: '',
                                                date: '',
                                                status: 'active'
                                            });
                                        }}
                                        className={`px-4 py-3 rounded-lg font-medium transition-colors ${theme === 'dark'
                                                ? 'bg-gray-600 hover:bg-gray-500 text-white'
                                                : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                                            }`}
                                    >
                                        Mégse
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                className={`p-4 rounded-lg ${post.status === 'solved' ?
                                        theme === 'dark' ? 'bg-green-900/30' : 'bg-green-50' :
                                        post.elutasitva === "true" ?
                                            theme === 'dark' ? 'bg-red-900/30' : 'bg-red-50' :
                                            post.elutasitva === "" ?
                                                theme === 'dark' ? 'bg-yellow-900/30' : 'bg-yellow-50' :
                                                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>
                                        {post.title}
                                    </h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(post)}
                                            className={`p-2 rounded-lg transition-colors ${theme === 'dark'
                                                    ? 'text-blue-400 hover:bg-gray-600'
                                                    : 'text-blue-600 hover:bg-gray-200'
                                                } ${(post.elutasitva === "" || post.elutasitva === "true") ? "opacity-50 cursor-not-allowed" : ""}`}
                                            disabled={post.elutasitva === "" || post.elutasitva === "true"}
                                            title={
                                                post.elutasitva === "" ? "Jóváhagyásra váró poszt nem módosítható" :
                                                    post.elutasitva === "true" ? "Elutasított poszt nem módosítható" :
                                                        "Poszt szerkesztése"
                                            }
                                        >
                                            <FaEdit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className={`p-2 rounded-lg transition-colors ${theme === 'dark'
                                                    ? 'text-red-400 hover:bg-gray-600'
                                                    : 'text-red-600 hover:bg-gray-200'
                                                }`}
                                            title="Poszt törlése"
                                        >
                                            <FaTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        <span className="font-medium">Leírás:</span> {post.description}
                                    </p>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        <span className="font-medium">Helyszín:</span> {post.location}
                                    </p>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        <span className="font-medium">Dátum:</span> {post.date}
                                    </p>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        <span className="font-medium">Állapot:</span> {
                                            post.elutasitva === "" ? "Jóváhagyásra vár" :
                                                post.elutasitva === "true" ? "Elutasítva" :
                                                    post.elutasitva === "false" ? "Aktív" :
                                                        post.status === 'active' ? 'Aktív' :
                                                            post.status === 'inactive' ? 'Inaktív' :
                                                                post.status === 'solved' ? 'Megoldva' : 'Jóváhagyásra vár'
                                        }
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPosts; 
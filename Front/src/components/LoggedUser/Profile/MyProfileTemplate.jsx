import React, { useState, useContext, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaCamera, FaTrash, FaSave, FaEdit } from 'react-icons/fa';
import UserContext from '../../../context/UserContext';
import { useTheme } from "../../../context/ThemeContext";
import SideBarMenu from '../../Assets/SidebarMenu/SideBarMenu';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const MyProfileTemplate = ({ user, onLogout }) => {
    // Biztosítsuk, hogy van érvényes felhasználói adat
    if (!user || !user.id) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl font-semibold text-red-500">
                    A felhasználói adatok nem érhetők el. Kérjük, jelentkezz be újra.
                </div>
            </div>
        );
    }
    
    const { refresh, SetRefresh } = useContext(UserContext);
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [email, setEmail] = useState(user.email || '');
    const [name, setName] = useState(user.username || '');
    const [profilePicture, setProfilePicture] = useState(user.profilePicture || '');
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newEmail, setNewEmail] = useState(user.email || '');
    const [newName, setNewName] = useState(user.username || '');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const token = localStorage.getItem("usertoken");
    const [activeTab, setActiveTab] = useState('profilom');
    const [isAdmin] = useState(user.admin === "true");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const defaultProfilePicture = '/default-profile.jpg';

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleProfilePictureUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            alert('Kérjük, válasszon ki egy fájlt!');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setUploadedFile(file);
        };
        reader.readAsDataURL(file);
    };

    const handleDeleteProfilePicture = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/delete-profile-picture', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Kép törlése sikertelen');
            }

            setProfilePicture('');
            setUploadedFile(null);
            SetRefresh((prev) => !prev);
            toast.success('Profilkép törölve');
        } catch (error) {
            console.error('Hiba történt:', error);
            toast.error('Hiba történt a kép törlése során.');
        }
    };

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordError('Az új jelszavak nem egyeznek.');
            toast.error('Az új jelszavak nem egyeznek!');
            return;
        }

        try {
            const userId = user.id;
            const response = await fetch(`http://localhost:8000/felhasznalok/${userId}/update-password`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.error || 'Jelszó módosítása sikertelen';
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('Jelszó frissítve:', data);
            setIsEditingPassword(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setPasswordError('');
            toast.success('Jelszó frissítve');
        } catch (error) {
            console.error('Hiba történt:', error);
            toast.error(error.message || 'Hiba történt a jelszó módosítása során!');
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const userId = user.id;
            let changes = [];

            if (uploadedFile) {
                const formData = new FormData();
                formData.append('file', uploadedFile);

                const uploadResponse = await fetch('http://localhost:8000/api/upload-profile-picture', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (!uploadResponse.ok) {
                    throw new Error('Kép feltöltése sikertelen');
                }

                const uploadData = await uploadResponse.json();
                setProfilePicture(uploadData.filePath);
                changes.push('profilkép');
                toast.success('Profilkép frissítve');
            }

            // Ellenőrizzük, hogy változott-e valamelyik adat
            const emailChanged = newEmail !== email;
            const nameChanged = newName !== name;

            if (emailChanged || nameChanged) {
            const response = await fetch(`http://localhost:8000/felhasznalok/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: newEmail, username: newName }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                // Check if it's the unique email constraint error
                if (errorData.error && errorData.error.includes("Ez az email cím már használatban van")) {
                    throw new Error("Ez az e-mail cím már használatban van.");
                } else {
                    throw new Error(errorData.error || 'Profil frissítése sikertelen');
                }
            }

            const data = await response.json();
            console.log('Profil frissítve:', data);
                
                if (nameChanged) {
                    changes.push('felhasználónév');
                    toast.success('Felhasználónév frissítve');
                }
                
                if (emailChanged) {
                    changes.push('email');
                    toast.success('Email cím frissítve');
                }

            setIsEditingEmail(false);
            setIsEditingName(false);
            setEmail(newEmail);
            setName(newName);
            }

            setUploadedFile(null);
            SetRefresh((prev) => !prev);
            
            // Ha nem történt változás, akkor tájékoztatjuk a felhasználót
            if (changes.length === 0) {
                toast.info('Nem történt változás');
            }
        } catch (error) {
            console.error('Hiba történt:', error);
            toast.error(error.message || 'Hiba történt a profil frissítése során.');
        }
    };

    // Profilkép URL-je
    const profilePictureUrl = user.profilePicture 
        ? `http://localhost:8000/${user.profilePicture.replace(/\\/g, '/')}?${Date.now()}`
        : defaultProfilePicture;
        
    // Kijelentkezés kezelése
    const handleLogout = () => {
        if (onLogout) {
            // Ha a szülő átadott logout függvényt, használjuk azt
            onLogout();
        } else {
            // Fallback a saját logout funkcióra
            localStorage.removeItem("usertoken");
            localStorage.removeItem("user");
            SetRefresh((prev) => !prev);
            toast.success("Sikeresen kijelentkeztél!");
            
            // Rövid késleltetés után navigálás és oldal frissítése
            setTimeout(() => {
                navigate("/home");
                // Explicit oldal frissítés a biztos újratöltéshez
                window.location.reload();
            }, 1000);
        }
    };

    return (
        <div className={`min-h-screen pt-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#F0F4F8]'}`}>
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Oldalsáv menü - a SideBarMenu komponens mobile-sensitive most */}
                    <SideBarMenu isAdmin={isAdmin} activeTab={activeTab} setActiveTab={setActiveTab} />

                    {/* Fő tartalom */}
                    <div className="flex-1">
                        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 mb-6`}>
                            <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>
                                Profilom
                            </h2>

                            {/* Profil kép szekció - mobilra optimalizált */}
                            <div className="flex flex-col md:flex-row md:items-center mb-8">
                                <div className="relative mb-4 md:mb-0 md:mr-6 flex justify-center">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
                                        <img
                                            src={profilePictureUrl}
                                            alt="Profilkép"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = defaultProfilePicture;
                                            }}
                                        />
                                    </div>
                                    <label htmlFor="profilePicture" className="absolute bottom-0 right-0 md:bottom-0 md:right-4 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition duration-300">
                                        <FaCamera className="text-white text-lg" />
                                        <input
                                            type="file"
                                            id="profilePicture"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleProfilePictureUpload}
                                        />
                                    </label>
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>
                                        {name}
                                    </h3>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {email}
                                    </p>
                                    {user.admin === "true" && (
                                        <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs ${theme === 'dark' ? 'bg-purple-700 text-white' : 'bg-purple-100 text-purple-800'}`}>
                                            Admin
                                        </span>
                                    )}
                                    {uploadedFile && (
                                        <div className="mt-4 flex justify-center md:justify-start">
                                            <button
                                                onClick={handleUpdateProfile}
                                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 flex items-center"
                                            >
                                                <FaSave className="mr-2" /> Profilkép mentése
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                          
                            {/* Responsive form card design */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Név szekció */}
                                <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg shadow-sm`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>
                                            <FaUser className="inline mr-2" /> Felhasználónév
                                        </h3>
                                        <button
                                            onClick={() => setIsEditingName(!isEditingName)}
                                            className={`text-sm px-2 py-1 rounded ${theme === 'dark' ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                        >
                                            <FaEdit className="inline mr-1" />
                                            {isEditingName ? 'Mégse' : 'Szerkesztés'}
                                        </button>
                                    </div>
                                    
                                    {isEditingName ? (
                                        <div className="mt-2">
                                            <div className="relative">
                                                <FaUser className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                                                <input
                                                    type="text"
                                                    value={newName}
                                                    onChange={(e) => setNewName(e.target.value)}
                                                    className={`w-full pl-10 pr-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700 focus:border-blue-500' : 'bg-white text-gray-700 border-gray-300 focus:border-blue-500'} border focus:outline-none focus:ring-2 focus:ring-blue-200`}
                                                    placeholder="Új felhasználónév"
                                                />
                                            </div>
                                            <button
                                                onClick={handleUpdateProfile}
                                                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 w-full flex items-center justify-center"
                                            >
                                                <FaSave className="mr-2" /> Mentés
                                            </button>
                                        </div>
                                    ) : (
                                        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} py-2`}>
                                            {name}
                                        </p>
                                    )}
                                </div>

                                {/* Email szekció */}
                                <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg shadow-sm`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>
                                            <FaEnvelope className="inline mr-2" /> Email cím
                                        </h3>
                                        <button
                                            onClick={() => setIsEditingEmail(!isEditingEmail)}
                                            className={`text-sm px-2 py-1 rounded ${theme === 'dark' ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                        >
                                            <FaEdit className="inline mr-1" />
                                            {isEditingEmail ? 'Mégse' : 'Szerkesztés'}
                                        </button>
                                    </div>
                                    
                                    {isEditingEmail ? (
                                        <div className="mt-2">
                                            <div className="relative">
                                                <FaEnvelope className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                                                <input
                                                    type="email"
                                                    value={newEmail}
                                                    onChange={(e) => setNewEmail(e.target.value)}
                                                    className={`w-full pl-10 pr-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700 focus:border-blue-500' : 'bg-white text-gray-700 border-gray-300 focus:border-blue-500'} border focus:outline-none focus:ring-2 focus:ring-blue-200`}
                                                    placeholder="Új email cím"
                                                />
                                            </div>
                                            <button
                                                onClick={handleUpdateProfile}
                                                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 w-full flex items-center justify-center"
                                            >
                                                <FaSave className="mr-2" /> Mentés
                                            </button>
                                        </div>
                                    ) : (
                                        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} py-2`}>
                                            {email}
                                        </p>
                                    )}
                                </div>

                                {/* Jelszó szekció */}
                                <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg shadow-sm md:col-span-2`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>
                                            <FaLock className="inline mr-2" /> Jelszó
                                        </h3>
                                        <button
                                            onClick={() => setIsEditingPassword(!isEditingPassword)}
                                            className={`text-sm px-2 py-1 rounded ${theme === 'dark' ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                        >
                                            <FaEdit className="inline mr-1" />
                                            {isEditingPassword ? 'Mégse' : 'Jelszó módosítása'}
                                        </button>
                                    </div>
                                    
                                    {isEditingPassword && (
                                        <div className="mt-2 space-y-3">
                                            <div className="relative">
                                                <FaLock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={oldPassword}
                                                    onChange={(e) => setOldPassword(e.target.value)}
                                                    className={`w-full pl-10 pr-10 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700 focus:border-blue-500' : 'bg-white text-gray-700 border-gray-300 focus:border-blue-500'} border focus:outline-none focus:ring-2 focus:ring-blue-200`}
                                                    placeholder="Jelenlegi jelszó"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                                    onClick={togglePasswordVisibility}
                                                >
                                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                </button>
                                            </div>
                                            
                                            <div className="relative">
                                                <FaLock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className={`w-full pl-10 pr-10 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700 focus:border-blue-500' : 'bg-white text-gray-700 border-gray-300 focus:border-blue-500'} border focus:outline-none focus:ring-2 focus:ring-blue-200`}
                                                    placeholder="Új jelszó"
                                                />
                                            </div>
                                            
                                            <div className="relative">
                                                <FaLock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className={`w-full pl-10 pr-10 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700 focus:border-blue-500' : 'bg-white text-gray-700 border-gray-300 focus:border-blue-500'} border focus:outline-none focus:ring-2 focus:ring-blue-200`}
                                                    placeholder="Új jelszó megerősítése"
                                                />
                                            </div>
                                            
                                            {passwordError && (
                                                <p className="text-red-500 text-sm">{passwordError}</p>
                                            )}
                                            
                                            <button
                                                onClick={handlePasswordChange}
                                                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 w-full flex items-center justify-center"
                                            >
                                                <FaSave className="mr-2" /> Jelszó módosítása
                                            </button>
                                        </div>
                                    )}
                                    
                                    {!isEditingPassword && (
                                        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} py-2`}>
                                            ********
                                        </p>
                                    )}
                                </div>

                                {/* Kijelentkezés doboz - az oldal alján könnyű elérhetőséggel */}
                                <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} p-6 rounded-lg shadow-sm md:col-span-2 mt-6`}>
                                    <div className="flex flex-col items-center justify-center">
                                        <h3 className={`font-semibold mb-4 text-center ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Kijelentkezés a fiókból
                                        </h3>
                                        <button
                                            onClick={handleLogout}
                                            className={`px-6 py-3 w-full sm:w-64 rounded-lg shadow-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 flex items-center justify-center 
                                            ${theme === 'dark' ? 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900' : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'}`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Kijelentkezés
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default MyProfileTemplate;
import React, { useState, useEffect } from 'react';
import { useTheme } from "../../../context/ThemeContext";
import { FaExclamationTriangle, FaEdit, FaPaperPlane, FaTimes, FaImage, FaCalendarAlt } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideBarMenu from '../../Assets/SidebarMenu/SideBarMenu';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Egyedi stílusok a dátumválasztóhoz
const customDatePickerStyle = `
  .react-datepicker-wrapper,
  .react-datepicker__input-container {
    display: block;
    width: 100%;
  }
  .react-datepicker {
    font-family: inherit;
    border: 2px solid #1A73E8;
    border-radius: 0.5rem;
    overflow: hidden;
  }
  .react-datepicker__header {
    background-color: #1A73E8;
    border-bottom: none;
    padding: 0.5rem;
  }
  .react-datepicker__current-month {
    color: white;
    font-weight: 600;
    font-size: 1rem;
  }
  .react-datepicker__day-name {
    color: white;
    font-weight: 500;
  }
  .react-datepicker__day {
    color: #073F48;
    border-radius: 0.25rem;
  }
  .react-datepicker__day:hover {
    background-color: #1A73E8;
    color: white;
  }
  .react-datepicker__day--selected {
    background-color: #1A73E8;
    color: white;
  }
  .react-datepicker__day--keyboard-selected {
    background-color: #1A73E8;
    color: white;
  }
  .react-datepicker__navigation {
    top: 0.5rem;
  }
  .react-datepicker__navigation-icon::before {
    border-color: white;
  }
  .dark .react-datepicker {
    background-color: #1F2937;
    border-color: #374151;
  }
  .dark .react-datepicker__header {
    background-color: #374151;
  }
  .dark .react-datepicker__day {
    color: #E5E7EB;
  }
  .dark .react-datepicker__day:hover {
    background-color: #4B5563;
  }
  .dark .react-datepicker__day--selected {
    background-color: #4B5563;
  }
  .dark .react-datepicker__day--keyboard-selected {
    background-color: #4B5563;
  }
  .dark .react-datepicker__current-month,
  .dark .react-datepicker__day-name {
    color: #E5E7EB;
  }
  
  /* DatePicker pozícionálási javítások */
  .react-datepicker-popper {
    z-index: 9999 !important;
  }
  
  /* Mobilon kisebb méretű DatePicker */
  @media (max-width: 640px) {
    .react-datepicker {
      font-size: 0.8rem;
    }
    .react-datepicker__current-month {
      font-size: 0.9rem;
    }
  }
`;

const UserMessages = () => {
  const [rejectedPosts, setRejectedPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem("usertoken");
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('uzenetek');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // Egyedi input a DatePicker komponenshez
  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <div className="relative w-full">
      <FaCalendarAlt className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#1A73E8]"} text-lg z-10`} />
      <input
        ref={ref}
        className={`w-full pl-10 pr-3 py-2 border rounded-lg ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-[#073F48]"} focus:outline-none focus:ring-2 focus:ring-blue-300 text-base cursor-pointer`}
        value={value}
        onClick={onClick}
        readOnly
        placeholder="Dátum kiválasztása"
      />
    </div>
  ));

  // Dátum változás kezelése
  const handleDateChange = (date) => {
    const finalDate = date || new Date();
    setSelectedDate(finalDate);
    setEditedData(prev => ({
      ...prev,
      datum: finalDate.toISOString().split("T")[0]
    }));
  };

  useEffect(() => {
    // Adjuk hozzá az egyedi stílusokat a head-hez
    const styleElement = document.createElement('style');
    styleElement.textContent = customDatePickerStyle;
    document.head.appendChild(styleElement);
    
    return () => {
      // Távolítsuk el a stílusokat
      styleElement.remove();
    };
  }, []);

  // Dátum formázása
  const formatDate = (dateString) => {
    if (!dateString) return "Ismeretlen dátum";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Érvénytelen dátum";
    return date.toLocaleDateString('hu-HU');
  };

  // Admin jogosultság ellenőrzése
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch("http://localhost:8000/felhasznalok/me", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        const userData = await response.json();
        setIsAdmin(userData.admin === "true");
      } catch (error) {
        console.error("Hiba a felhasználó adatok lekérésekor:", error);
      }
    };
    checkAdminStatus();
  }, [token]);

  // Elutasított posztok lekérése
  const fetchData = async () => {
    try {
      const postsResponse = await fetch('http://localhost:8000/felhasznalok/rejected-posts', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!postsResponse.ok) {
        throw new Error('Elutasított posztok lekérése sikertelen');
      }

      const postsData = await postsResponse.json();
      setRejectedPosts(postsData);
    } catch (error) {
      console.error('Hiba történt:', error);
      toast.error('Hiba történt az adatok lekérése során');
    }
  };

  // Poszt szerkesztése
  const openEditModal = (post) => {
    setEditingPost(post);
    setEditedData({
      allatfaj: post.allatfaj,
      kategoria: post.kategoria || '',
      neme: post.neme,
      szin: post.szin,
      meret: post.meret,
      helyszin: post.helyszin,
      chipszam: post.chipszam,
      egyeb_info: post.egyeb_info || '',
      datum: post.datum || '',
    });
    setSelectedDate(post.datum ? new Date(post.datum) : null);
    setImagePreview(post.kep ? `http://localhost:8000/images/${post.kep}` : null);
    setNewImage(null);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingPost(null);
    setIsEditModalOpen(false);
    setNewImage(null);
    setImagePreview(null);
  };

  // Kép kezelése
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImage(file);
      
      // Előnézet beállítása
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Poszt újraküldése
  const handleSave = async () => {
    try {
      // FormData használata a kép feltöltéshez
      const formData = new FormData();
      
      // Szöveges adatok hozzáadása
      Object.keys(editedData).forEach(key => {
        if (editedData[key] !== null && editedData[key] !== undefined) {
          formData.append(key, editedData[key]);
        }
      });
      
      // Kép hozzáadása, ha van új kép
      if (newImage) {
        formData.append('kep', newImage);
      }

      const response = await fetch(`http://localhost:8000/felhasznalok/allatok/${editingPost.id}/resubmit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Ne állítsuk be a Content-Type-ot, mert a böngésző automatikusan beállítja a határt a FormData számára
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Poszt újraküldése sikertelen');
      }

      closeEditModal();
      toast.success('Poszt sikeresen újraküldve jóváhagyásra!');
      fetchData();
    } catch (error) {
      console.error('Hiba történt:', error);
      toast.error('Hiba történt a poszt újraküldése során');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-[#F0F4F8]"}`}>
      <div className="container mx-auto px-4 pt-24 pb-12 flex flex-col md:flex-row gap-8">
        {/* SideBarMenu komponens */}
        <SideBarMenu 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isAdmin={isAdmin} 
        />

        {/* Fő tartalom */}
        <div className={`flex-1 ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-xl shadow-lg p-6`}>
          <h2 className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>
            Elutasított posztok
          </h2>

          {rejectedPosts.length === 0 ? (
            <div className={`text-center py-8 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              <FaExclamationTriangle className="mx-auto h-12 w-12 mb-4" />
              <p className="text-lg">Nincsenek elutasított posztok</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rejectedPosts.map((post) => (
                <div 
                  key={post.id} 
                  className={`relative flex flex-col justify-between p-6 rounded-2xl shadow-md border transition hover:shadow-lg ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"}`}
                >
                  {/* Állat képe */}
                  {post.kep && (
                    <div className="mb-4 relative w-full h-48 rounded-lg overflow-hidden">
                      <img 
                        src={`http://localhost:8000/images/${post.kep}`} 
                        alt={`${post.allatfaj} képe`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Kép betöltési hiba:', e);
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${theme === "dark" ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-800"}`}>Elutasítva</span>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${theme === "dark" ? "bg-yellow-900/30 text-yellow-400" : "bg-yellow-100 text-yellow-800"}`}>{post.elutasitasoka}</span>
                    </div>
                    <h4 className={`font-bold text-lg mb-1 ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>{post.allatfaj}</h4>
                    <div className={`text-sm mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Helyszín: {post.helyszin}</div>
                    <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Kategória: {post.kategoria || '-'}</div>
                    <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Szín: {post.szin}</div>
                    <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Méret: {post.meret}</div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => openEditModal(post)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm ${theme === "dark" ? "bg-gray-800 hover:bg-gray-900 text-white" : "bg-white hover:bg-gray-100 text-[#073F48]"}`}
                    >
                      <FaEdit />
                      Szerkesztés
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Szerkesztő modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            {/* Háttér overlay */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-40"
              onClick={closeEditModal}
            />
            
            {/* Modal tartalom */}
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl mx-auto p-0 z-50 overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Fejléc */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#e3f0ff] to-[#f8fafc] dark:from-gray-900 dark:to-gray-800">
                <h2 className="text-2xl font-bold text-[#1A73E8] dark:text-blue-300">Poszt szerkesztése</h2>
                <button 
                  onClick={closeEditModal} 
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              {/* Tartalom */}
              <div className="flex flex-col md:flex-row gap-6 px-8 py-6 bg-white dark:bg-gray-800">
                {/* Bal oldal: kép szerkesztés */}
                <div className="md:w-2/5 w-full flex flex-col items-center">
                  <div className="w-full h-72 rounded-2xl overflow-hidden shadow-lg border-2 border-blue-200 dark:border-blue-900 bg-gray-50 dark:bg-gray-900 flex items-center justify-center mb-4 relative group">
                    {imagePreview ? (
                      <img 
                        src={imagePreview}
                        alt="Állat képe"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-gray-400 dark:text-gray-600">KÉP</span>
                    )}
                    
                    {/* Kép feltöltés overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <label className="cursor-pointer bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                        <FaImage className="h-6 w-6 text-blue-500" />
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col items-center w-full">
                    <span className="inline-block px-4 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 shadow mb-2">#{editingPost?.id}</span>
                    <span className="text-lg font-bold text-[#073F48] dark:text-white mb-1">{editedData.allatfaj}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{editedData.kategoria}</span>
                    
                    {/* Kép feltöltési gomb */}
                    <label className="mt-3 cursor-pointer flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      <FaImage />
                      Kép módosítása
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                    {newImage && (
                      <span className="mt-1 text-xs text-green-600 dark:text-green-400">
                        Új kép kiválasztva: {newImage.name}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Jobb oldal: mezők */}
                <div className="md:w-3/5 w-full flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Állatfaj</label>
                      <input
                        type="text"
                        value={editedData.allatfaj}
                        onChange={(e) => setEditedData({...editedData, allatfaj: e.target.value})}
                        className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Kategória</label>
                      <input
                        type="text"
                        value={editedData.kategoria}
                        onChange={(e) => setEditedData({...editedData, kategoria: e.target.value})}
                        className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Neme</label>
                      <input
                        type="text"
                        value={editedData.neme}
                        onChange={(e) => setEditedData({...editedData, neme: e.target.value})}
                        className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Szín</label>
                      <input
                        type="text"
                        value={editedData.szin}
                        onChange={(e) => setEditedData({...editedData, szin: e.target.value})}
                        className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Méret</label>
                      <input
                        type="text"
                        value={editedData.meret}
                        onChange={(e) => setEditedData({...editedData, meret: e.target.value})}
                        className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Helyszín</label>
                      <input
                        type="text"
                        value={editedData.helyszin}
                        onChange={(e) => setEditedData({...editedData, helyszin: e.target.value})}
                        className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Chipszám</label>
                      <input
                        type="text"
                        value={editedData.chipszam}
                        onChange={(e) => setEditedData({...editedData, chipszam: e.target.value})}
                        className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Dátum</label>
                      <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="yyyy.MM.dd"
                        maxDate={new Date()}
                        customInput={<CustomInput />}
                        showPopperArrow={false}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Egyéb információ</label>
                    <textarea
                      value={editedData.egyeb_info}
                      onChange={(e) => setEditedData({...editedData, egyeb_info: e.target.value})}
                      className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-300"
                      rows="3"
                    />
                  </div>
                </div>
              </div>

              {/* Láb */}
              <div className="flex justify-end gap-3 px-8 py-6 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#e3f0ff] to-[#f8fafc] dark:from-gray-900 dark:to-gray-800">
                <button
                  onClick={closeEditModal}
                  className="px-4 py-2 rounded-lg font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Mégse
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg font-semibold bg-[#1A73E8] hover:bg-[#1557B0] text-white shadow-md transition"
                >
                  Újraküldés
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="bottom-right" theme={theme} />
    </div>
  );
};

export default UserMessages;
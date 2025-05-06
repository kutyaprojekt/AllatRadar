import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTimes, FaImage, FaCalendarAlt } from 'react-icons/fa';
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

const EditAnimalModal = ({ animal, onClose, onUpdate, theme }) => {
    const [formData, setFormData] = useState({
        allatfaj: animal.allatfaj || '',
        kategoria: animal.kategoria || '',
        datum: animal.datum || '',
        szin: animal.szin || '',
        helyszin: animal.helyszin || '',
        egyeb_info: animal.egyeb_info || '',
        neme: animal.neme || '',
        meret: animal.meret || '',
        chipszam: animal.chipszam || ''
    });
    const [selectedDate, setSelectedDate] = useState(formData.datum ? new Date(formData.datum) : new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(animal.filePath ? `http://localhost:8000/${animal.filePath}` : (animal.kep ? `http://localhost:8000/images/${animal.kep}` : null));

    // Dátum formázása
    const formatDate = (dateString) => {
        if (!dateString) return "Ismeretlen dátum";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Érvénytelen dátum";
        return date.toLocaleDateString('hu-HU');
    };

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
        setFormData(prev => ({
            ...prev,
            datum: finalDate.toISOString().split("T")[0]
        }));
    };

    React.useEffect(() => {
        // Adjuk hozzá az egyedi stílusokat a head-hez
        const styleElement = document.createElement('style');
        styleElement.textContent = customDatePickerStyle;
        document.head.appendChild(styleElement);
        
        return () => {
            // Távolítsuk el a stílusokat
            styleElement.remove();
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const token = localStorage.getItem('usertoken');
            const formDataToSend = new FormData();
            
            // Szöveges adatok hozzáadása
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== undefined) {
                    formDataToSend.append(key, formData[key]);
                }
            });
            
            // Kép hozzáadása, ha van új kép
            if (newImage) {
                formDataToSend.append('kep', newImage);
            }

            const response = await fetch(`http://localhost:8000/felhasznalok/allatok/${animal.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formDataToSend
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Hiba történt a poszt frissítése során');
            }
            
            toast.success(data.message || 'Poszt sikeresen frissítve!');
            if (onUpdate) {
                onUpdate();
            }
            onClose();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 py-6">
                {/* Háttér overlay */}
                <div 
                    className="fixed inset-0 bg-black bg-opacity-40"
                    onClick={onClose}
                />
                
                {/* Modal tartalom */}
                <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl mx-auto p-0 z-50 overflow-hidden border border-gray-200 dark:border-gray-700 max-h-[90vh] flex flex-col">
                    {/* Fejléc */}
                    <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#e3f0ff] to-[#f8fafc] dark:from-gray-900 dark:to-gray-800">
                        <h2 className="text-2xl font-bold text-[#1A73E8] dark:text-blue-300">Poszt szerkesztése</h2>
                        <button 
                            onClick={onClose} 
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Tartalom */}
                    <div className="flex flex-col md:flex-row gap-6 px-8 py-6 bg-white dark:bg-gray-800 overflow-y-auto">
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
                                <span className="inline-block px-4 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 shadow mb-2">#{animal?.id}</span>
                                <span className="text-lg font-bold text-[#073F48] dark:text-white mb-1">{formData.allatfaj}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{formData.kategoria}</span>
                                
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
                                        name="allatfaj"
                                        value={formData.allatfaj}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-300"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Kategória</label>
                                    <input
                                        type="text"
                                        name="kategoria"
                                        value={formData.kategoria}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Neme</label>
                                    <input
                                        type="text"
                                        name="neme"
                                        value={formData.neme}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Szín</label>
                                    <input
                                        type="text"
                                        name="szin"
                                        value={formData.szin}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-300"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Méret</label>
                                    <input
                                        type="text"
                                        name="meret"
                                        value={formData.meret}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Helyszín</label>
                                    <input
                                        type="text"
                                        name="helyszin"
                                        value={formData.helyszin}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-300"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Chipszám</label>
                                    <input
                                        type="text"
                                        name="chipszam"
                                        value={formData.chipszam}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Dátum</label>
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={handleDateChange}
                                        customInput={<CustomInput />}
                                        dateFormat="yyyy.MM.dd"
                                        maxDate={new Date()}
                                        required
                                        showPopperArrow={false}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Egyéb információ</label>
                                <textarea
                                    name="egyeb_info"
                                    value={formData.egyeb_info}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-300"
                                    rows="3"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Láb */}
                    <div className="flex justify-end gap-3 px-8 py-6 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#e3f0ff] to-[#f8fafc] dark:from-gray-900 dark:to-gray-800">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        >
                            Mégse
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className={`px-4 py-2 rounded-lg font-semibold bg-[#1A73E8] hover:bg-[#1557B0] text-white shadow-md transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Mentés...' : 'Mentés'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditAnimalModal;
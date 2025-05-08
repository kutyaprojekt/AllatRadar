import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTimes, FaImage, FaCalendarAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../styles/datepicker.css"; // Tailwind-alapú datepicker stílusok
import Modal from 'react-modal';

// Ensure Modal is accessible
Modal.setAppElement('#root');

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
    const [scrollPosition, setScrollPosition] = useState(0);
    
    // Saját toast notification
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    // Görgetési pozíció mentése a megnyitáskor
    useEffect(() => {
        setScrollPosition(window.pageYOffset);
    }, []);

    const handleAfterOpen = () => {
        document.body.classList.add('modal-open');
    };

    const handleAfterClose = () => {
        document.body.classList.remove('modal-open');
        // Visszagörgetés a modal bezárása után
        setTimeout(() => {
            window.scrollTo(0, scrollPosition);
        }, 100);
    };

    // Cleanup effect a komponens unmountoláskor
    useEffect(() => {
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, []);

    // Notification megjelenítése, majd eltüntetése
    useEffect(() => {
        if (notification.show) {
            const timer = setTimeout(() => {
                setNotification({ ...notification, show: false });
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // Dátum formázás
    const formatDate = (dateString) => {
        if (!dateString) return "Ismeretlen dátum";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Érvénytelen dátum";
        return date.toLocaleDateString('hu-HU');
    };

    // DatePicker egyedi input
    const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
        <div className="relative w-full">
            <FaCalendarAlt className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-blue-500"} text-lg z-10`} />
            <input
                ref={ref}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"} focus:outline-none focus:ring-2 focus:ring-blue-300 text-base cursor-pointer`}
                value={value}
                onClick={onClick}
                readOnly
                placeholder="Dátum kiválasztása"
            />
        </div>
    ));

    // Dátum változás kezelés
    const handleDateChange = (date) => {
        const finalDate = date || new Date();
        setSelectedDate(finalDate);
        setFormData(prev => ({
            ...prev,
            datum: finalDate.toISOString().split("T")[0]
        }));
    };

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
            
            // Előnézet beállítás
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
            
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== undefined) {
                    formDataToSend.append(key, formData[key]);
                }
            });
            
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
            toast.success('Poszt sikeresen frissítve!', { theme: theme === "dark" ? "dark" : "light" });
            
            if (typeof onUpdate === 'function') {
                onUpdate(data.animal);
            }
            
            onClose();
        } catch (error) {
            // Hiba esetén saját értesítés
            setNotification({
                show: true,
                message: error.message || 'Hiba történt a poszt frissítése során',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Saját toast notification */}
            {notification.show && (
                <div className="fixed top-5 right-5 z-[9999] animate-fade-in">
                    <div className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
                        notification.type === 'success' 
                            ? 'bg-green-100 text-green-800 border-l-4 border-green-500' 
                            : 'bg-red-100 text-red-800 border-l-4 border-red-500'
                    }`}>
                        {notification.type === 'success' ? (
                            <FaCheckCircle className="text-green-500 text-xl" />
                        ) : (
                            <FaExclamationCircle className="text-red-500 text-xl" />
                        )}
                        <span className="font-medium">{notification.message}</span>
                    </div>
                </div>
            )}

            <Modal
                isOpen={true}
                onRequestClose={onClose}
                onAfterOpen={handleAfterOpen}
                onAfterClose={handleAfterClose}
                contentLabel="Poszt szerkesztése"
                className={`${theme === "dark" ? "bg-gray-800 text-white" : "bg-white"} rounded-xl w-full max-w-2xl mx-auto p-0 shadow-2xl border ${theme === "dark" ? "border-gray-700" : "border-gray-200"} max-h-[90vh] overflow-y-auto`}
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                style={{
                    overlay: {
                        backdropFilter: 'blur(5px)',
                        zIndex: 1000
                    },
                    content: {
                        position: 'relative',
                        top: 'auto',
                        left: 'auto',
                        right: 'auto',
                        bottom: 'auto',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }
                }}
            >
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#e3f0ff] to-[#f8fafc] dark:from-gray-900 dark:to-gray-800">
                    <h2 className="text-2xl font-bold text-[#1A73E8] dark:text-blue-300">Poszt szerkesztése</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="overflow-y-auto">
                    <div className="flex flex-col md:flex-row gap-6 px-8 py-6 bg-white dark:bg-gray-800">
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
                        
                        <div className="md:w-3/5 w-full flex flex-col gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Állatfaj</label>
                                    <input 
                                        type="text" 
                                        name="allatfaj"
                                        value={formData.allatfaj}
                                        onChange={handleInputChange}
                                        className={`w-full p-2 border rounded-lg ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"} focus:outline-none focus:ring-2 focus:ring-blue-300`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Kategória</label>
                                    <input 
                                        type="text" 
                                        name="kategoria"
                                        value={formData.kategoria}
                                        onChange={handleInputChange}
                                        className={`w-full p-2 border rounded-lg ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"} focus:outline-none focus:ring-2 focus:ring-blue-300`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Nem</label>
                                    <input 
                                        type="text" 
                                        name="neme"
                                        value={formData.neme}
                                        onChange={handleInputChange}
                                        className={`w-full p-2 border rounded-lg ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"} focus:outline-none focus:ring-2 focus:ring-blue-300`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Szín</label>
                                    <input 
                                        type="text" 
                                        name="szin"
                                        value={formData.szin}
                                        onChange={handleInputChange}
                                        className={`w-full p-2 border rounded-lg ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"} focus:outline-none focus:ring-2 focus:ring-blue-300`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Méret</label>
                                    <input 
                                        type="text" 
                                        name="meret"
                                        value={formData.meret}
                                        onChange={handleInputChange}
                                        className={`w-full p-2 border rounded-lg ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"} focus:outline-none focus:ring-2 focus:ring-blue-300`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Helyszín</label>
                                    <input 
                                        type="text" 
                                        name="helyszin"
                                        value={formData.helyszin}
                                        onChange={handleInputChange}
                                        className={`w-full p-2 border rounded-lg ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"} focus:outline-none focus:ring-2 focus:ring-blue-300`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Chipszám</label>
                                    <input 
                                        type="text" 
                                        name="chipszam"
                                        value={formData.chipszam}
                                        onChange={handleInputChange}
                                        className={`w-full p-2 border rounded-lg ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"} focus:outline-none focus:ring-2 focus:ring-blue-300`}
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
                                <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Egyéb információk</label>
                                <textarea 
                                    name="egyeb_info"
                                    value={formData.egyeb_info}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className={`w-full p-2 border rounded-lg ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"} focus:outline-none focus:ring-2 focus:ring-blue-300`}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    
                    <div className="px-8 py-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-white dark:bg-gray-800">
                        <button 
                            type="button"
                            onClick={onClose}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
                        >
                            Mégsem
                        </button>
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className={`px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Mentés...' : 'Mentés'}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default EditAnimalModal;
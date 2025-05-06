import React, { useEffect, useState, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTheme } from '../../context/ThemeContext';

const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { theme } = useTheme();
  
  // Dinamikus osztályok a témához
  const isDarkMode = theme === 'dark';
  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = isDarkMode ? 'text-white' : 'text-gray-900';
  const subTextClass = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      const token = localStorage.getItem('usertoken');
      
      // Ha nincs token, nem admin
      if (!token) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch('http://localhost:8000/felhasznalok/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Nem sikerült lekérni a felhasználói adatokat');
        }
        
        const userData = await response.json();
        const adminStatus = userData.admin === "true";
        
        setIsAdmin(adminStatus);
        
        if (!adminStatus) {
          toast.error('Ez az oldal csak adminisztrátorok számára elérhető!', {
            position: 'top-center',
            autoClose: 5000,
          });
        }
      } catch (error) {
        console.error('Hiba a jogosultság ellenőrzése során:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminStatus();
  }, []);
  
  if (loading) {
    // Betöltés alatt egy egyszerű betöltési jelzés
    return (
      <div className={`min-h-screen flex items-center justify-center ${bgClass}`}>
        <div className={`text-center p-8 rounded-lg shadow-lg ${cardClass}`}>
          <div className="flex justify-center">
            <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className={`mt-4 text-lg font-medium ${textClass}`}>Jogosultság ellenőrzése...</p>
          <p className={`mt-2 text-sm ${subTextClass}`}>Ez az oldal csak adminisztrátorok számára elérhető.</p>
        </div>
      </div>
    );
  }
  
  // Ha nem admin, átirányítjuk a főoldalra
  if (!isAdmin) {
    // Hiba jelzése
    toast.error('Ez az oldal csak adminisztrátorok számára elérhető!', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    
    // Átirányítás késleltetéssel, hogy a felhasználó láthassa a toast üzenetet
    return (
      <div className={`min-h-screen flex items-center justify-center ${bgClass}`}>
        <div className={`text-center p-8 rounded-lg shadow-lg ${cardClass} max-w-md`}>
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className={`text-xl font-semibold ${textClass} mb-2`}>Hozzáférés megtagadva</h2>
          <p className={`text-gray-600 ${subTextClass} mb-6`}>Ez az oldal csak adminisztrátori jogosultsággal rendelkező felhasználók számára elérhető.</p>
          <p className={`text-sm ${subTextClass}`}>Átirányítás a kezdőlapra...</p>
          
          <Navigate to="/" state={{ from: location }} replace />
        </div>
      </div>
    );
  }
  
  // Ha admin, megjelenítjük a védett tartalmat
  return children;
};

export default AdminRoute; 
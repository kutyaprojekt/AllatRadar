import React, { useEffect, useState, useContext } from 'react';
import MyProfileTemplate from './MyProfileTemplate';
import UserContext from '../../../context/UserContext';
import { useTheme } from '../../../context/ThemeContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const MyProfile = () => {
  const { user, refresh, getCurrentUser, loading: contextLoading, SetRefresh } = useContext(UserContext);
  const { theme } = useTheme();
  const [localLoading, setLocalLoading] = useState(true);
  const token = localStorage.getItem("usertoken");
  const navigate = useNavigate();
  
  // Kijelentkezés kezelése a szülő komponensben
  const handleLogout = () => {
    localStorage.removeItem("usertoken");
    localStorage.removeItem("user");
    SetRefresh((prev) => !prev);
    toast.success("Sikeresen kijelentkeztél!");
    
    // Rövid késleltetés után navigálás és oldal frissítése
    setTimeout(() => {
      navigate("/home");
      window.location.reload();
    }, 1000);
  };
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Csak egyszer futtassuk le az első rendereléskor vagy ha szükség van újratöltésre
  useEffect(() => {
    
    const loadUserData = async () => {
      if (!token) {
        setLocalLoading(false);
        return;
      }
      
      try {
        if (getCurrentUser && (!user || !user.id)) {
          const userData = await getCurrentUser(token);
        }
      } catch (error) {
      } finally {
        setLocalLoading(false);
      }
    };

    loadUserData();
    
    return () => {
    };
  }, []); // Üres függőségek tömbje - csak egyszer fut le

  // Külön effect a felhasználó jelenlétének ellenőrzésére
  useEffect(() => {
  }, [user]);

  // A tényleges loading állapot a helyi és a kontextus loading állapotok kombinációja
  const isLoading = localLoading || contextLoading;
  
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-b from-[#f0fdff] to-[#e0e3fe]'}`}>
        <div className="text-2xl font-bold">Betöltés...</div>
      </div>
    );
  }

  if (!user || !user.id) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-b from-[#f0fdff] to-[#e0e3fe]'}`}>
        <div className="text-2xl font-bold text-red-500">Nem sikerült betölteni a profil adatokat.</div>
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={theme === 'dark' ? 'dark' : 'light'}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-b from-[#f0fdff] to-[#e0e3fe]'}`}>
      <MyProfileTemplate user={user} onLogout={handleLogout} />
    </div>
  );
};

export default MyProfile;
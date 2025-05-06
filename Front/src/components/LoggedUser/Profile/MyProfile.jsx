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
  
  console.log("[MyProfile] Rendering with:", { 
    hasUser: Boolean(user), 
    userId: user?.id,
    contextLoading, 
    localLoading 
  });
  
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
        console.log("[MyProfile] Loading user data...");
        setLocalLoading(true);
        
        if (getCurrentUser && (!user || !user.id)) {
          console.log("[MyProfile] Fetching user data via getCurrentUser");
          const userData = await getCurrentUser(token);
          console.log("[MyProfile] User data fetched:", Boolean(userData));
        } else {
          console.log("[MyProfile] User data already available or getCurrentUser not available");
        }
      } catch (error) {
        console.error("[MyProfile] Error loading user data:", error);
      } finally {
        console.log("[MyProfile] Finished loading user data, setting localLoading to false");
        setLocalLoading(false);
      }
    };

    loadUserData();
    
    return () => {
      console.log("[MyProfile] Cleanup effect");
    };
  }, []); // Üres függőségek tömbje - csak egyszer fut le

  // Külön effect a felhasználó jelenlétének ellenőrzésére
  useEffect(() => {
    console.log("[MyProfile] User changed:", { hasUser: Boolean(user), userId: user?.id });
  }, [user]);

  // A tényleges loading állapot a helyi és a kontextus loading állapotok kombinációja
  const isLoading = localLoading || contextLoading;
  
  if (isLoading) {
    console.log("[MyProfile] Rendering loading state");
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#F0F4F8]'}`}>
        <div className="text-2xl font-bold">Betöltés...</div>
      </div>
    );
  }

  if (!user || !user.id) {
    console.log("[MyProfile] Rendering error state - no user data");
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#F0F4F8]'}`}>
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

  console.log("[MyProfile] Rendering profile with user:", user.username);
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#F0F4F8]'}`}>
      <MyProfileTemplate user={user} onLogout={handleLogout} />
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
};

export default MyProfile;
import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../../../context/UserContext';
import MyProfileTemplate from './MyProfileTemplate';
import { useTheme } from '../../../context/ThemeContext';

const Profilom = () => {
  const { user } = useContext(UserContext);
  const { theme } = useTheme();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Ha nincs bejelentkezett felhasználó, átirányítjuk a bejelentkezési oldalra
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#F0F4F8]'}`}>
      <MyProfileTemplate user={user} />
    </div>
  );
};

export default Profilom; 
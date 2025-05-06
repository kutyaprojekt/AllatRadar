import React, { useState, useContext, useEffect } from "react";
import UserContext from "../../context/UserContext";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from "../../context/ThemeContext";

const Login = () => {
  const { SetRefresh, getCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [formState, setFormState] = useState({
    email: "",
    password: "",
    username: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.className = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-[#f0fdff] to-[#e0e3fe] text-[#0c4a6e]';
  }, [theme]);

  const writeData = (e) => {
    setFormState((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleToastClose = () => {
    // Navigálás a főoldalra
    navigate('/home');
    
    // Kis késleltetéssel frissítjük az oldalt, hogy a navbar frissüljön
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const login = async () => {
    try {
      const response = await fetch("http://localhost:8000/felhasznalok/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formState),
      });
      
      const data = await response.json();
      
      if (data.token) {
        // Token mentése és felhasználó lekérése
        localStorage.setItem("usertoken", data.token);
        await getCurrentUser(data.token);
        SetRefresh((prev) => !prev);
        
        // Sikeres toast üzenet és időzített átirányítás
        toast.success("Sikeres bejelentkezés!", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClose: handleToastClose
        });
      } else {
        toast.error(data.error, {
          position: "top-right",
          autoClose: 2500
        });
      }
    } catch (error) {
      toast.error("Hiba történt a bejelentkezés során. Kérjük próbálja újra.", {
        position: "top-right",
        autoClose: 2500
      });
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-b from-[#f0fdff] to-[#e0e3fe]'} p-4`}>
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-3xl shadow-xl w-full max-w-lg border-2 ${theme === 'dark' ? 'border-gray-700' : 'border-[#0c4a6e]'}`}>
        <h1 className={`text-4xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-[#0c4a6e]'} mb-10`}>Bejelentkezés</h1>
        <div className="space-y-6">
          <div className="relative flex flex-col">
            <label className={`block text-xl font-medium ${theme === 'dark' ? 'text-white' : 'text-[#0c4a6e]'}`}>Felhasználónév</label>
            <div className="relative w-full">
              <FaUser className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-[#0c4a6e]'} text-xl`} />
              <input
                onChange={writeData}
                id="username"
                type="text"
                className={`w-full pl-12 pr-4 py-3 border-2 ${theme === 'dark' ? 'border-gray-700 bg-gray-700 text-white' : 'border-[#0c4a6e] bg-white text-[#0c4a6e]'} rounded-lg focus:outline-none focus:ring-2 ${theme === 'dark' ? 'focus:ring-gray-500' : 'focus:ring-[#0c4a6e]'} text-lg`}
                placeholder="Felhasználónév"
              />
            </div>
          </div>
          <div className="relative flex flex-col">
            <label className={`block text-xl font-medium ${theme === 'dark' ? 'text-white' : 'text-[#0c4a6e]'}`}>Jelszó</label>
            <div className="relative w-full">
              <FaLock className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-[#0c4a6e]'} text-xl`} />
              <input
                id="password"
                type={passwordVisible ? "text" : "password"}
                className={`w-full pl-12 pr-4 py-3 border-2 ${theme === 'dark' ? 'border-gray-700 bg-gray-700 text-white' : 'border-[#0c4a6e] bg-white text-[#0c4a6e]'} rounded-lg focus:outline-none focus:ring-2 ${theme === 'dark' ? 'focus:ring-gray-500' : 'focus:ring-[#0c4a6e]'} text-lg`}
                placeholder="Jelszó"
                onChange={writeData}
              />
              <span
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? <FaEyeSlash className={`${theme === 'dark' ? 'text-gray-400' : 'text-[#0c4a6e]'}`} size={20} /> : <FaEye className={`${theme === 'dark' ? 'text-gray-400' : 'text-[#0c4a6e]'}`} size={20} />}
              </span>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-[#0c4a6e]'}`}>
              Nincs még fiókod?{" "}
              <Link to="/regisztracio" className={`${theme === 'dark' ? 'text-[#3d63b6]' : 'text-[#0c4a6e]'} font-semibold`}>
                Regisztráció
              </Link>
            </p>
          </div>
          <button
            onClick={login}
            className={`w-full ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-[#0c4a6e] hover:bg-[#083344]'} text-white py-3 px-5 rounded-lg transition duration-300 text-xl font-semibold`}
          >
            Bejelentkezés
          </button>
          <ToastContainer 
            position="top-right"
            autoClose={1500}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
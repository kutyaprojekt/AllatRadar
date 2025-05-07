import { useState, useEffect } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { FaUser, FaLock, FaEnvelope, FaPhone } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useTheme } from "../../context/ThemeContext";

const Register = () => {
  const { SetRefresh } = useContext(UserContext);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  let formObj = {
    username: "",
    password: "",
    password2: "",
    email: "",
    phonenumber: "",
  };

  const [formState, setFormState] = useState(formObj);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.className = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-[#f0fdff] to-[#e0e3fe] text-[#0c4a6e]';
  }, [theme]);

  const writeData = (e) => {
    const { id, value } = e.target;

    // Telefonszám validáció
    if (id === "phonenumber") {
      // Opcionális + jel elején, utána csak számok
      if (!/^(\+?\d*)$/.test(value)) {
        return;
      }
      if (value.length > 15) {
        return;
      }
    }

    setFormState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const reguser = async () => {
    // Email formátum ellenőrzés
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formState.email)) {
      toast.error("Érvénytelen email formátum!");
      return;
    }

    // Telefonszám formátum ellenőrzés
    if (!/^(\+?\d+)$/.test(formState.phonenumber)) {
      toast.error("A telefonszám csak számokat és + előjelet tartalmazhat!");
      return;
    }

    // Telefonszám hossz ellenőrzés
    if (formState.phonenumber.length > 15) {
      toast.error("A telefonszám nem lehet hosszabb 15 karakternél!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/felhasznalok/regisztracio", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (data.message === "Sikeres regisztráció!" || data.success) {
        // Sikeres regisztráció és átirányítás
        toast.success("Sikeres regisztráció!", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClose: () => navigate("/login")
        });
        SetRefresh((prev) => !prev);
      } else {
        toast.error(data.error, {
          position: "top-right",
          autoClose: 2500
        });
      }
    } catch (error) {
      toast.error("Hiba történt a regisztráció során. Kérjük próbálja újra.", {
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
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-3xl shadow-xl w-full max-w-2xl border-2 ${theme === 'dark' ? 'border-gray-700' : 'border-[#0c4a6e]'}`}>
        <h1 className={`text-4xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-[#0c4a6e]'} mb-10`}>Regisztráció</h1>
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className={`block text-xl font-medium ${theme === 'dark' ? 'text-white' : 'text-[#0c4a6e]'}`}>Email-cím</label>
            <div className="relative w-full">
              <FaEnvelope className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-[#0c4a6e]'} text-xl`} />
              <input
                id="email"
                type="text"
                className={`w-full pl-12 pr-4 py-3 border-2 ${theme === 'dark' ? 'border-gray-700 bg-gray-700 text-white' : 'border-[#0c4a6e] bg-white text-[#0c4a6e]'} rounded-lg focus:outline-none focus:ring-2 ${theme === 'dark' ? 'focus:ring-gray-500' : 'focus:ring-[#0c4a6e]'} text-lg`}
                placeholder="Email-cím"
                onChange={writeData}
              />
            </div>
          </div>

          <div className="col-span-1">
            <label className={`block text-xl font-medium ${theme === 'dark' ? 'text-white' : 'text-[#0c4a6e]'}`}>Felhasználónév</label>
            <div className="relative w-full">
              <FaUser className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-[#0c4a6e]'} text-xl`} />
              <input
                id="username"
                type="text"
                className={`w-full pl-12 pr-4 py-3 border-2 ${theme === 'dark' ? 'border-gray-700 bg-gray-700 text-white' : 'border-[#0c4a6e] bg-white text-[#0c4a6e]'} rounded-lg focus:outline-none focus:ring-2 ${theme === 'dark' ? 'focus:ring-gray-500' : 'focus:ring-[#0c4a6e]'} text-lg`}
                placeholder="Felhasználónév"
                onChange={writeData}
              />
            </div>
          </div>

          <div className="col-span-1">
            <label className={`block text-xl font-medium ${theme === 'dark' ? 'text-white' : 'text-[#0c4a6e]'}`}>Telefonszám</label>
            <div className="relative w-full">
              <FaPhone className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-[#0c4a6e]'} text-xl`} />
              <input
                id="phonenumber"
                type="text"
                maxLength={15}
                className={`w-full pl-12 pr-4 py-3 border-2 ${theme === 'dark' ? 'border-gray-700 bg-gray-700 text-white' : 'border-[#0c4a6e] bg-white text-[#0c4a6e]'} rounded-lg focus:outline-none focus:ring-2 ${theme === 'dark' ? 'focus:ring-gray-500' : 'focus:ring-[#0c4a6e]'} text-lg`}
                placeholder="Telefonszám"
                onChange={writeData}
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="col-span-1">
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

          <div className="col-span-1">
            <label className={`block text-xl font-medium ${theme === 'dark' ? 'text-white' : 'text-[#0c4a6e]'}`}>Jelszó újra</label>
            <div className="relative w-full">
              <FaLock className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-[#0c4a6e]'} text-xl`} />
              <input
                id="password2"
                type={passwordVisible ? "text" : "password"}
                className={`w-full pl-12 pr-4 py-3 border-2 ${theme === 'dark' ? 'border-gray-700 bg-gray-700 text-white' : 'border-[#0c4a6e] bg-white text-[#0c4a6e]'} rounded-lg focus:outline-none focus:ring-2 ${theme === 'dark' ? 'focus:ring-gray-500' : 'focus:ring-[#0c4a6e]'} text-lg`}
                placeholder="Jelszó újra"
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

          <div className="col-span-2">
            <button
              onClick={reguser}
              className={`w-full ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-[#0c4a6e] hover:bg-[#083344]'} text-white py-3 px-5 rounded-lg transition duration-300 text-xl font-semibold`}
            >
              Regisztráció
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
    </div>
  );
};

export default Register;
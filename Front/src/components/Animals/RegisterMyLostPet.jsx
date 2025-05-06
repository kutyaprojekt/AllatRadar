import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaPaw, FaCalendarAlt, FaMapMarkerAlt, FaImage, FaInfoCircle, FaVenusMars, FaRuler, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from "../../context/ThemeContext";

const RegisterMyLostPet = () => {
  const { SetRefresh } = useContext(UserContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("usertoken");
  const { theme } = useTheme();

  // Add state for form steps
  const [currentStep, setCurrentStep] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [formState, setFormState] = useState({
    allatfaj: "",
    allatkategoria: "",
    mikorveszettel: "",
    chipszam: "",
    allatneme: "",
    allatszine: "",
    allatmerete: "",
    eltuneshelyszine: "",
    egyeb_infok: "",
    elutasitva: "",
    user_id: "",
  });

  const [file, setFile] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.className = theme === "dark" ? "bg-gray-900 text-white dark" : "bg-gradient-to-b from-[#f0fdff] to-[#e0e3fe] text-[#073F48]";
    
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [theme]);

  const writeData = (e) => {
    const { id, value } = e.target;
    
    // Fields that should have first letter of each word capitalized
    const capitalizeFields = ['allatfaj', 'allatkategoria', 'allatneme', 'allatszine', 'eltuneshelyszine'];
    
    if (capitalizeFields.includes(id)) {
      const capitalizedValue = value
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      setFormState(prevState => ({
        ...prevState,
        [id]: capitalizedValue
      }));
    } else {
      setFormState(prevState => ({
        ...prevState,
        [id]: value
      }));
    }
  };

  const handleDateChange = (date) => {
    const finalDate = date || new Date();
    setSelectedDate(finalDate);
    
    // Format the date as YYYY-MM-DD for storage
    const year = finalDate.getFullYear();
    const month = (finalDate.getMonth() + 1).toString().padStart(2, '0');
    const day = finalDate.getDate().toString().padStart(2, '0');
    
    setFormState(prev => ({
      ...prev,
      mikorveszettel: `${year}-${month}-${day}`
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const regAnimal = async () => {
    if (!formState.allatfaj || !formState.eltuneshelyszine || !selectedDate || !file) {
      toast.error("Minden kötelező mezőt ki kell tölteni!");
      return;
    }

    const formData = new FormData();
    for (const key in formState) {
      if (key === 'chipszam' && formState[key]) {
        formData.append(key, parseInt(formState[key], 10));
      } else {
        formData.append(key, formState[key]);
      }
    }
    formData.append("file", file);
    
    // Az eltűnés időpontját már beállítottuk a formState-ben, nem kell újra hozzáadni
    // formData.append("mikorveszettel", formState.mikorveszettel);

    try {
      const response = await fetch("http://localhost:8000/felhasznalok/elveszettallat", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.message === "Sikeres adatfelvitel!") {
        toast.success("Sikeres adatfelvitel!");
        SetRefresh((prev) => !prev);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Hiba történt az adatküldéskor:", error);
      toast.error("Hiba történt az adatküldéskor.");
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !formState.allatfaj) {
      toast.error("Az állatfaj megadása kötelező!");
      return;
    }
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  // A dátumválasztó komponens módosítása
  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <div className="relative w-full">
      <FaCalendarAlt className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#0c4a6e]"} text-lg z-10`} />
      <input
        ref={ref}
        className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#0c4a6e] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#0c4a6e]"} text-base cursor-pointer`}
        value={value}
        onClick={onClick}
        readOnly
        placeholder="Eltűnés Időpontja"
      />
    </div>
  ));

  // Step 1 fields
  const renderStep1 = () => (
    <>
      {/* Állatfaj */}
      <div className={isMobile ? "col-span-2" : "col-span-1"}>
        <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Állatfaj <span className="text-red-500">*</span></label>
        <div className="relative w-full">
          <FaPaw className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#0c4a6e]"} text-lg`} />
          <input
            id="allatfaj"
            type="text"
            value={formState.allatfaj}
            className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#0c4a6e] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#0c4a6e]"} text-base`}
            placeholder="Állatfaj"
            onChange={writeData}
            required
          />
        </div>
      </div>

      {/* Állatkategória */}
      <div className={isMobile ? "col-span-2" : "col-span-1"}>
        <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Állatkategória</label>
        <div className="relative w-full">
          <FaPaw className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#0c4a6e]"} text-lg`} />
          <input
            id="allatkategoria"
            type="text"
            value={formState.allatkategoria}
            className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#0c4a6e] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#0c4a6e]"} text-base`}
            placeholder="Állatkategória"
            onChange={writeData}
          />
        </div>
      </div>

      {/* Chipszám */}
      <div className={isMobile ? "col-span-2" : "col-span-1"}>
        <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Microchip Szám</label>
        <div className="relative w-full">
          <FaPaw className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#0c4a6e]"} text-lg`} />
          <input
            id="chipszam"
            type="text"
            value={formState.chipszam}
            pattern="[0-9]{15}"
            maxLength={15}
            inputMode="numeric"
            className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#0c4a6e] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#0c4a6e]"} text-base`}
            placeholder="15 számjegyű microchip"
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 15);
              setFormState(prev => ({
                ...prev,
                chipszam: value
              }));
            }}
          />
        </div>
        {formState.chipszam && formState.chipszam.length !== 15 && (
          <p className={`text-sm mt-1 ${theme === "dark" ? "text-red-400" : "text-red-600"}`}>
            A microchip számnak pontosan 15 számjegyből kell állnia
          </p>
        )}
      </div>

      {/* Eltűnés dátuma */}
      <div className={isMobile ? "col-span-2" : "col-span-1"}>
        <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Eltűnés Időpontja <span className="text-red-500">*</span></label>
        <div className="w-full">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            customInput={<CustomInput />}
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
            className="w-full"
            wrapperClassName="w-full block"
          />
        </div>
      </div>

      {/* Navigációs gombok - csak mobilnézetben */}
      {isMobile && (
        <div className="col-span-2 flex justify-end">
          <button
            onClick={nextStep}
            className={`${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-[#0c4a6e] hover:bg-[#083344]"} text-white py-2 px-4 rounded-lg transition duration-300 text-lg font-semibold flex items-center gap-2`}
          >
            Következő <FaArrowRight />
          </button>
        </div>
      )}

       
    </>
  );

  // Step 2 fields
  const renderStep2 = () => (
    <>
      {/* Kisállat Neme */}
      <div className={isMobile ? "col-span-2" : "col-span-1"}>
        <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Kisállat Neme</label>
        <div className="relative w-full">
          <FaVenusMars className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#0c4a6e]"} text-lg`} />
          <input
            id="allatneme"
            type="text"
            value={formState.allatneme}
            className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#0c4a6e] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#0c4a6e]"} text-base`}
            placeholder="Kisállat Neme"
            onChange={writeData}
          />
        </div>
      </div>

      {/* Kisállat Színe */}
      <div className={isMobile ? "col-span-2" : "col-span-1"}>
        <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Kisállat Színe</label>
        <div className="relative w-full">
          <FaPaw className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#0c4a6e]"} text-lg`} />
          <input
            id="allatszine"
            type="text"
            value={formState.allatszine}
            className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#0c4a6e] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#0c4a6e]"} text-base`}
            placeholder="Kisállat Színe"
            onChange={writeData}
          />
        </div>
      </div>

      {/* Kisállat Mérete */}
      <div className={isMobile ? "col-span-2" : "col-span-1"}>
        <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Kisállat Mérete</label>
        <div className="relative w-full">
          <FaRuler className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#0c4a6e]"} text-lg`} />
          <select
            id="allatmerete"
            value={formState.allatmerete}
            className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#0c4a6e] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#0c4a6e]"} text-base`}
            onChange={writeData}
          >
            <option value="">Válassz méretet</option>
            <option value="kicsi">Kicsi (0-30cm)</option>
            <option value="közepes">Közepes (30-60cm)</option>
            <option value="nagy">Nagy (60-100cm)</option>
          </select>
        </div>
      </div>

      {/* Navigációs gombok - csak mobilnézetben */}
      {isMobile && (
        <div className="col-span-2 flex justify-between">
          <button
            onClick={prevStep}
            className={`${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-[#0c4a6e] hover:bg-[#083344]"} text-white py-2 px-4 rounded-lg transition duration-300 text-lg font-semibold flex items-center gap-2`}
          >
            <FaArrowLeft /> Vissza
          </button>
          <button
            onClick={nextStep}
            className={`${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-[#0c4a6e] hover:bg-[#083344]"} text-white py-2 px-4 rounded-lg transition duration-300 text-lg font-semibold flex items-center gap-2`}
          >
            Következő <FaArrowRight />
          </button>
        </div>
      )}
    </>
  );

  // Step 3 fields
  const renderStep3 = () => (
    <>
      {/* Eltűnés helyszíne */}
      <div className={isMobile ? "col-span-2" : "col-span-1"}>
        <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Eltűnés Helyszíne <span className="text-red-500">*</span></label>
        <div className="relative w-full">
          <FaMapMarkerAlt className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#0c4a6e]"} text-lg`} />
          <input
            id="eltuneshelyszine"
            type="text"
            value={formState.eltuneshelyszine}
            className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#0c4a6e] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#0c4a6e]"} text-base`}
            placeholder="Eltűnés helyszíne"
            onChange={writeData}
            required
          />
        </div>
      </div>

      {/* Egyéb Információk */}
      <div className="col-span-2">
        <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Egyéb Információk</label>
        <div className="relative w-full">
          <FaInfoCircle className={`absolute left-3 top-3 transform ${theme === "dark" ? "text-gray-400" : "text-[#0c4a6e]"} text-lg`} />
          <textarea
            id="egyeb_infok"
            value={formState.egyeb_infok}
            className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#0c4a6e] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#0c4a6e]"} text-base resize-none`}
            placeholder="További információk..."
            onChange={writeData}
            rows={2}
          />
        </div>
      </div>

      {/* Kép feltöltése */}
      <div className="col-span-2">
        <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Kép feltöltése <span className="text-red-500">*</span></label>
        <div className="relative w-full">
          <FaImage className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#0c4a6e]"} text-lg`} />
          <input
            type="file"
            onChange={handleFileChange}
            className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#0c4a6e] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#0c4a6e]"} text-base`}
            accept="image/*"
            required
          />
        </div>
        {preview && (
          <div className="mt-4 flex justify-center">
            <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded" />
          </div>
        )}
      </div>

      {/* Navigációs gombok - csak mobilnézetben */}
      {isMobile && (
        <div className="col-span-2 flex justify-between">
          <button
            onClick={prevStep}
            className={`${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-[#0c4a6e] hover:bg-[#083344]"} text-white py-2 px-4 rounded-lg transition duration-300 text-lg font-semibold flex items-center gap-2`}
          >
            <FaArrowLeft /> Vissza
          </button>
          <button
            onClick={regAnimal}
            className={`${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-[#0c4a6e] hover:bg-[#083344]"} text-white py-2 px-4 rounded-lg text-lg font-semibold transition duration-300 flex items-center ml-auto`}
          >
            <FaPaw className="mr-1" /> Regisztrálás
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-900" : "bg-gradient-to-b from-[#f0fdff] to-[#e0e3fe]"} p-4`}>
      {/* Bal oldal: Űrlap */}
      <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} p-6 rounded-3xl shadow-xl w-full max-w-lg border-2 ${theme === "dark" ? "border-gray-700" : "border-[#0c4a6e]"}`}>
        {isMobile ? (
          <div className="mb-6">
            <h1 className={`text-2xl font-bold text-center ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>
              Elveszett állatom regisztrálása
            </h1>
            <div className="flex justify-center items-center mt-4">
              <div className="flex items-center w-full max-w-xs relative">
                {[1, 2, 3].map((step) => (
                  <React.Fragment key={step}>
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                        currentStep >= step 
                          ? theme === "dark" 
                            ? "bg-blue-500 text-white" 
                            : "bg-[#0c4a6e] text-white" 
                          : theme === "dark" 
                            ? "bg-gray-600 text-gray-300" 
                            : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {step}
                    </div>
                    {step < 3 && (
                      <div className={`flex-1 h-1 ${
                        currentStep > step 
                          ? theme === "dark" 
                            ? "bg-blue-500" 
                            : "bg-[#0c4a6e]" 
                          : theme === "dark" 
                            ? "bg-gray-600" 
                            : "bg-gray-200"
                      }`}></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="text-center mt-2">
              <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-[#0c4a6e]"}`}>
                {currentStep === 1 ? "Alapinformációk" : currentStep === 2 ? "Tulajdonságok" : "Helyszín és kép"}
              </span>
            </div>
          </div>
        ) : (
          <h1 className={`text-2xl font-bold mb-6 text-center ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>
            Elveszett állatom regisztrálása
          </h1>
        )}
        <div className="grid grid-cols-2 gap-4">
          {isMobile ? (
            currentStep === 1 ? renderStep1() : currentStep === 2 ? renderStep2() : renderStep3()
          ) : (
            <>
              {renderStep1()}
              {renderStep2()}
              <div className={isMobile ? "col-span-2" : "col-span-1"}>
                <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Eltűnés Helyszíne <span className="text-red-500">*</span></label>
                <div className="relative w-full">
                  <FaMapMarkerAlt className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#0c4a6e]"} text-lg`} />
                  <input
                    id="eltuneshelyszine"
                    type="text"
                    value={formState.eltuneshelyszine}
                    className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#0c4a6e] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#0c4a6e]"} text-base`}
                    placeholder="Eltűnés helyszíne"
                    onChange={writeData}
                    required
                  />
                </div>
              </div>
              <div className="col-span-2">
                <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Egyéb Információk</label>
                <div className="relative w-full">
                  <FaInfoCircle className={`absolute left-3 top-3 transform ${theme === "dark" ? "text-gray-400" : "text-[#0c4a6e]"} text-lg`} />
                  <textarea
                    id="egyeb_infok"
                    value={formState.egyeb_infok}
                    className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#0c4a6e] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#0c4a6e]"} text-base resize-none`}
                    placeholder="További információk..."
                    onChange={writeData}
                    rows={2}
                  />
                </div>
              </div>
              <div className="col-span-2">
                <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Kép feltöltése <span className="text-red-500">*</span></label>
                <div className="relative w-full">
                  <FaImage className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#0c4a6e]"} text-lg`} />
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#0c4a6e] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#0c4a6e]"} text-base`}
                    accept="image/*"
                    required
                  />
                </div>
                {preview && (
                  <div className="mt-4 flex justify-center">
                    <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded" />
                  </div>
                )}
              </div>
              {!isMobile && (
                <div className="col-span-2 flex justify-center mt-4">
                  <button
                    onClick={regAnimal}
                    className={`w-full ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-[#0c4a6e] hover:bg-[#083344]"} text-white py-3 px-6 rounded-lg text-lg font-semibold transition duration-300 flex items-center justify-center gap-2`}
                  >
                    <FaPaw className="mr-1" /> Regisztrálás
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Jobb oldal: Kép és inspiráló szöveg (csak gépi nézetben) */}
      {!isMobile && (
        <div className="hidden xl:flex flex-col justify-center items-center ml-8 w-1/3">
          <div className={`mt-6 text-center p-8 rounded-3xl shadow-xl border-2 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white bg-opacity-90 border-[#0c4a6e]"}`}>
            <h2 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-[#0c4a6e]"} mb-6`}>
              Segíts megtalálni elveszett kedvencedet!
            </h2>
            <div className="mb-6">
              <img src="/images/lost-pet.svg" alt="Elveszett kisállat" className="mx-auto h-48 mb-4" 
                  onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
            </div>
            <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-[#074F57]"} mb-6 leading-relaxed`}>
              Az elveszett kisállatod mihamarabbi megtalálása érdekében <span className={`font-semibold ${theme === "dark" ? "text-white" : ""}`}>minél pontosabb információkat</span> adj meg! 
              Minél részletesebb a leírásod, annál nagyobb az esélye, hogy valaki felismeri kedvencedet.
            </p>
            <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-[#074F57]"} mb-6 leading-relaxed`}>
              <span className={`text-xl font-semibold block mb-2 ${theme === "dark" ? "text-gray-200" : "text-[#0c4a6e]"}`}>Hasznos tippek:</span>
              <ul className="list-disc list-inside space-y-2 text-left">
                <li>Tölts fel jó minőségű, felismerhető képet</li>
                <li>Add meg a pontos helyszínt, ahol utoljára láttad</li>
                <li>Írd le kedvenced egyedi ismertetőjegyeit</li>
                <li>Tüntesd fel a chipszámot, ha rendelkezik vele</li>
                <li>Oszd meg a hirdetést a közösségi médiában is</li>
              </ul>
            </p>
            <div className={`mt-8 p-5 rounded-xl ${theme === "dark" ? "bg-gray-700" : "bg-[#e1f5fe]"}`}>
              <p className={`font-medium text-lg ${theme === "dark" ? "text-white" : "text-[#0c4a6e]"}`}>
                Oldalunkon az elmúlt évben több mint <span className="font-bold">2,500</span> kisállat talált haza gazdájához a közösség segítségével!
              </p>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default RegisterMyLostPet;
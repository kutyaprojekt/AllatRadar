import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaPaw, FaCalendarAlt, FaMapMarkerAlt, FaImage, FaInfoCircle, FaVenusMars, FaRuler, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from "../../context/ThemeContext";

const RegisterThePetIFound = () => {
  const { SetRefresh } = useContext(UserContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("usertoken");
  const { theme } = useTheme();

  // Add state for form steps and mobile detection
  const [currentStep, setCurrentStep] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  let formObj = {
    talaltvagyelveszett: "talalt",
    allatfaj: "",
    allatkategoria: "",
    mikorveszettel: "",
    allatszine: "",
    allatmerete: "",
    egyeb_infok: "",
    eltuneshelyszine: "",
    visszakerult_e: "",
    filePath: "",
  };

  const [formState, setFormState] = useState({
    ...formObj,
    mikorveszettel: new Date().toISOString().split("T")[0]
  });
  const [file, setFile] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [preview, setPreview] = useState(null);
  const formData = new FormData();

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
    // Fields that should have first letter of each word capitalized
    const capitalizeFields = ['allatfaj', 'allatkategoria', 'allatneme', 'allatszine', 'eltuneshelyszine'];
    
    if (capitalizeFields.includes(e.target.id)) {
      const capitalizedValue = e.target.value
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      setFormState((prevState) => ({
        ...prevState,
        [e.target.id]: capitalizedValue,
      }));
    } else {
      setFormState((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
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
    }
  };

  const regAnimal = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Kérjük, válassz ki egy képet!");
      return;
    }

    if (!formState.allatfaj || !formState.eltuneshelyszine) {
      toast.error("Kérjük, töltsd ki a kötelező mezőket (Állatfaj, Találat Helyszíne)!");
      return;
    }

    const formData = new FormData();
    for (const key in formState) {
      formData.append(key, formState[key]);
    }

    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/felhasznalok/talaltallat", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.message === "Sikeres adatfelvitel!") {
        SetRefresh((prev) => !prev);
        
        // Egyetlen toast üzenet jóváhagyásról
        toast.success("Bejegyzése jóváhagyásra vár", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClose: () => navigate("/home") // Toast bezárása után navigálás
        });
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
    if (currentStep === 2 && !formState.eltuneshelyszine) {
      toast.error("A találat helyszíne megadása kötelező!");
      return;
    }
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const renderMobileStep1 = () => (
    <div className="space-y-4">
      <div>
        <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"} mb-1`}>
          Állatfaj <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <FaPaw className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#0c4a6e]"} text-lg`} />
          <input
            id="allatfaj"
            type="text"
            value={formState.allatfaj}
            onChange={writeData}
            className={`w-full pl-10 pr-3 py-3 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#0c4a6e] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#0c4a6e]"} text-base transition-all duration-200 hover:border-opacity-80`}
            placeholder="Állatfaj"
            required
          />
        </div>
      </div>

      <div>
        <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>
          Állatkategória
        </label>
        <div className="relative">
          <FaPaw className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#0c4a6e]"} text-lg`} />
          <input
            id="allatkategoria"
            type="text"
            value={formState.allatkategoria}
            onChange={writeData}
            className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#0c4a6e] bg-white text-[#073F48]"} rounded-lg`}
            placeholder="Állatkategória"
          />
        </div>
      </div>

      <div>
        <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>
          Találat Időpontja
        </label>
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
    </div>
  );

  const renderMobileStep2 = () => (
    <div className="space-y-4">
      <div>
        <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>
          Kisállat Színe
        </label>
        <div className="relative">
          <FaPaw className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#0c4a6e]"} text-lg`} />
          <input
            id="allatszine"
            type="text"
            value={formState.allatszine}
            onChange={writeData}
            className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#0c4a6e] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#0c4a6e]"} text-base`}
            placeholder="Kisállat színe"
          />
        </div>
      </div>

      <div>
        <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>
          Kisállat Mérete
        </label>
        <div className="relative">
          <FaRuler className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#0c4a6e]"} text-lg`} />
          <select
            id="allatmerete"
            value={formState.allatmerete}
            onChange={writeData}
            className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#0c4a6e] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#0c4a6e]"} text-base`}
          >
            <option value="">Válassz méretet</option>
            <option value="kicsi">Kicsi (0-30cm)</option>
            <option value="közepes">Közepes (30-60cm)</option>
            <option value="nagy">Nagy (60-100cm)</option>
          </select>
        </div>
      </div>

      <div>
        <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>
          Találat Helyszíne <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <FaMapMarkerAlt className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#0c4a6e]"} text-lg`} />
          <input
            id="eltuneshelyszine"
            type="text"
            value={formState.eltuneshelyszine}
            onChange={writeData}
            className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#0c4a6e] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#0c4a6e]"} text-base`}
            placeholder="Találat helyszíne"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderMobileStep3 = () => (
    <div className="space-y-4">
      <div>
        <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"} mb-1`}>
          Egyéb Információk
        </label>
        <div className="relative">
          <FaInfoCircle className={`absolute left-3 top-3 ${theme === "dark" ? "text-gray-400" : "text-[#0c4a6e]"} text-lg`} />
          <textarea
            id="egyeb_infok"
            value={formState.egyeb_infok}
            onChange={writeData}
            className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#0c4a6e] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#0c4a6e]"} text-base resize-none`}
            placeholder="További információk..."
            rows="2"
          />
        </div>
      </div>

      <div>
        <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>
          Kép feltöltése <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <FaImage className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#0c4a6e]"} text-lg`} />
          <input
            type="file"
            onChange={handleFileChange}
            className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#0c4a6e] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#0c4a6e]"} text-base`}
            accept="image/*"
            required
          />
        </div>
      </div>
    </div>
  );

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
        placeholder="Találat Időpontja"
      />
    </div>
  ));

  const renderMobileView = () => (
    <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-900" : "bg-gradient-to-b from-[#f0fdff] to-[#e0e3fe]"} px-4`}>
      <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow-lg max-w-md w-full border-2 ${theme === "dark" ? "border-gray-700" : "border-[#0c4a6e]"}`}>
        <div className="mb-6">
          <h1 className={`text-2xl font-bold text-center ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>
            Talált állat regisztrálása
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
              {currentStep === 1 ? "Alapinformációk" : currentStep === 2 ? "Tulajdonságok" : "További információk"}
            </span>
          </div>
        </div>

        <form onSubmit={regAnimal} className="space-y-6">
          {currentStep === 1 && renderMobileStep1()}
          {currentStep === 2 && renderMobileStep2()}
          {currentStep === 3 && renderMobileStep3()}

          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  theme === "dark" ? "bg-gray-700" : "bg-[#0c4a6e]"
                } text-white`}
              >
                <FaArrowLeft className="mr-2" /> Vissza
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  theme === "dark" ? "bg-gray-700" : "bg-[#0c4a6e]"
                } text-white ${currentStep === 1 ? "ml-auto" : ""}`}
              >
                Következő <FaArrowRight className="ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg ${
                  theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-[#0c4a6e] hover:bg-[#083344]"
                } text-white ml-auto`}
              >
                Regisztrálás
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );

  // Az eredeti asztali nézet megtartása
  const renderDesktopView = () => (
    <div className={`pt-20 min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-900" : "bg-gradient-to-b from-[#f0fdff] to-[#e0e3fe]"} p-4`}>
      <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} p-6 rounded-3xl shadow-xl w-full max-w-lg border-2 ${theme === "dark" ? "border-gray-700" : "border-[#0c4a6e]"}`}>
        <h1 className={`text-3xl font-bold text-center ${theme === "dark" ? "text-white" : "text-[#073F48]"} mb-6`}>
          Talált állat regisztrálása
        </h1>
        
        <form onSubmit={regAnimal} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Állatfaj */}
            <div className="col-span-1">
              <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>
                Állatfaj <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaPaw className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#0c4a6e]"} text-lg`} />
                <input
                  id="allatfaj"
                  type="text"
                  value={formState.allatfaj}
                  onChange={writeData}
                  className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#0c4a6e] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#0c4a6e]"} text-base`}
                  placeholder="Állatfaj"
                  required
                />
              </div>
            </div>

            {/* Állatkategória */}
            <div className="col-span-1">
              <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>
                Állatkategória
              </label>
              <div className="relative">
                <FaPaw className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#0c4a6e]"} text-lg`} />
                <input
                  id="allatkategoria"
                  type="text"
                  value={formState.allatkategoria}
                  onChange={writeData}
                  className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#0c4a6e] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#0c4a6e]"} text-base`}
                  placeholder="Állatkategória"
                />
              </div>
            </div>

            {/* Dátumválasztó */}
            <div className="col-span-1">
              <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>
                Találat Időpontja
              </label>
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

            {/* Kisállat Színe */}
            <div className="col-span-1">
              <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>
                Kisállat Színe
              </label>
              <div className="relative">
                <FaPaw className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#0c4a6e]"} text-lg`} />
                <input
                  id="allatszine"
                  type="text"
                  value={formState.allatszine}
                  onChange={writeData}
                  className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#0c4a6e] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#0c4a6e]"} text-base`}
                  placeholder="Kisállat színe"
                />
              </div>
            </div>

            {/* Kisállat Mérete */}
            <div className="col-span-1">
              <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>
                Kisállat Mérete
              </label>
              <div className="relative">
                <FaRuler className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#0c4a6e]"} text-lg`} />
                <select
                  id="allatmerete"
                  value={formState.allatmerete}
                  onChange={writeData}
                  className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#0c4a6e] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#0c4a6e]"} text-base`}
                >
                  <option value="">Válassz méretet</option>
                  <option value="kicsi">Kicsi (0-30cm)</option>
                  <option value="közepes">Közepes (30-60cm)</option>
                  <option value="nagy">Nagy (60-100cm)</option>
                </select>
              </div>
            </div>

            {/* Találat Helyszíne */}
            <div className="col-span-1">
              <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>
                Találat Helyszíne <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaMapMarkerAlt className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#0c4a6e]"} text-lg`} />
                <input
                  id="eltuneshelyszine"
                  type="text"
                  value={formState.eltuneshelyszine}
                  onChange={writeData}
                  className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#0c4a6e] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#0c4a6e]"} text-base`}
                  placeholder="Találat helyszíne"
                  required
                />
              </div>
            </div>

            {/* Egyéb Információk */}
            <div className="col-span-2">
              <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>
                Egyéb Információk
              </label>
              <div className="relative">
                <FaInfoCircle className={`absolute left-3 top-3 ${theme === "dark" ? "text-gray-400" : "text-[#0c4a6e]"} text-lg`} />
                <textarea
                  id="egyeb_infok"
                  value={formState.egyeb_infok}
                  onChange={writeData}
                  className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#0c4a6e] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#0c4a6e]"} text-base resize-none`}
                  placeholder="További információk..."
                  rows="2"
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
            </div>
          </div>

          <button
            type="submit"
            className={`w-full ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-[#0c4a6e] hover:bg-[#083344]"} text-white py-3 px-6 rounded-lg text-lg font-semibold transition duration-300 flex items-center justify-center gap-2`}
          >
            <FaPaw className="mr-1" /> Regisztrálás
          </button>
        </form>
      </div>

      {/* Jobb oldali inspiráló szöveg */}
      <div className="hidden xl:flex flex-col justify-center items-center ml-8 w-1/3">
        <div className={`mt-6 text-center p-8 rounded-3xl shadow-xl border-2 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white bg-opacity-90 border-[#0c4a6e]"} flex flex-col justify-between`} style={{ minHeight: "600px" }}>
          <div>
            <h2 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-[#0c4a6e]"} mb-4`}>
              Találtál egy kisállatot? Segíts hazajutni!
            </h2>
            <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-[#074F57]"} mb-5 leading-relaxed`}>
              A talált kisállat és gazdája összehozásában kulcsfontosságú, hogy <span className={`font-semibold ${theme === "dark" ? "text-white" : ""}`}>minél részletesebb információkat</span> adj meg róla. Ezzel segíted, hogy a gazdi felismerhesse elveszett kedvencét!
            </p>
          </div>
          
          <div className="flex-grow">
            <p className={`text-xl font-semibold mb-3 ${theme === "dark" ? "text-gray-200" : "text-[#0c4a6e]"}`}>Találtál egy kisállatot? Ezt tedd:</p>
            <ul className={`list-disc list-inside space-y-2 text-left text-lg ${theme === "dark" ? "text-gray-300" : "text-[#074F57]"}`}>
              <li>Ellenőrizd, van-e a kisállaton nyakörv vagy bilétán elérhetőség</li>
              <li>Vidd el állatorvoshoz, hogy ellenőrizzék a microchipet</li>
              <li>Készíts jó minőségű fotókat több szögből</li>
              <li>Oszd meg a megtalálás helyszínén kihelyezett hirdetéseken</li>
              <li>Legyél türelmes és gondoskodó a megtalált állattal</li>
            </ul>
          </div>
          
          <div>
            <div className="flex items-center justify-center my-4">
              <img 
                src="/images/found-pet.svg" 
                alt="Talált kisállat" 
                className="mx-auto h-24 max-w-full" 
                onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} 
              />
            </div>
            
            <div className={`p-5 rounded-xl ${theme === "dark" ? "bg-gray-700" : "bg-[#e1f5fe]"}`}>
              <p className={`font-medium text-lg ${theme === "dark" ? "text-white" : "text-[#0c4a6e]"}`}>
                Egy jól kitöltött adatlap akár <span className="font-bold">24 órán belül</span> sikeres találkozást eredményezhet a gazdi és elveszett kedvence között!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? renderMobileView() : renderDesktopView()}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === "dark" ? "dark" : "light"}
      />
    </>
  );
};

export default RegisterThePetIFound;
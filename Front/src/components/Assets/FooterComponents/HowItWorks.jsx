import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';

const HowItWorks = () => {
    const { theme } = useTheme();

    return (
        <div className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-[#073F48]"} min-h-screen pt-16`}>
            {/* Hero Section */}
            <div className={`${theme === "dark" ? "bg-gray-800" : "bg-gradient-to-r from-[#64B6FF] to-[#A7D8FF]"} text-white py-12 md:py-32 relative overflow-hidden`}>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-3xl md:text-6xl font-bold mb-4">Hogyan Működik az ÁllatRadar?</h1>
                    <p className="text-sm md:text-2xl mb-6">
                        Az ÁllatRadar segít az elveszett háziállatok gyors és hatékony visszakerülésében. Ismerd meg, hogyan működik!
                    </p>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="container mx-auto px-4 py-8 md:py-20">
                <h2 className={`text-2xl md:text-4xl font-bold text-center ${theme === "dark" ? "text-white" : "text-[#073F48]"} mb-6 md:mb-16`}>Három Egyszerű Lépésben</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Step 1 */}
                    <div className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-100"} p-6 rounded-2xl shadow-xl transition-transform duration-300 hover:scale-105`}>
                        <div className="text-center mb-4">
                            <span className={`${theme === "dark" ? "text-white" : "text-[#073F48]"} text-4xl font-bold`}>1</span>
                        </div>
                        <h3 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-[#073F48]"} mb-4`}>Állat Bejelentése</h3>
                        <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                            Regisztrálj és töltsd fel az elveszett állatod adatait, beleértve a fajt, nevet, színt, méretet és a helyet, ahol eltűnt.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-100"} p-6 rounded-2xl shadow-xl transition-transform duration-300 hover:scale-105`}>
                        <div className="text-center mb-4">
                            <span className={`${theme === "dark" ? "text-white" : "text-[#073F48]"} text-4xl font-bold`}>2</span>
                        </div>
                        <h3 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-[#073F48]"} mb-4`}>Állatok Feltöltése és Keresése</h3>
                        <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                            Az ÁllatRadaron keresztül egyszerűen feltöltheted az elveszett vagy megtalált állatod adatait, és más felhasználók közöttük kereshetnek. Így növelheted az esélyét, hogy megtalálják az elveszett kedvenced, vagy visszaadj egy megtalált állatot gazdájának.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-100"} p-6 rounded-2xl shadow-xl transition-transform duration-300 hover:scale-105`}>
                        <div className="text-center mb-4">
                            <span className={`${theme === "dark" ? "text-white" : "text-[#073F48]"} text-4xl font-bold`}>3</span>
                        </div>
                        <h3 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-[#073F48]"} mb-4`}>Állat Visszakerülése</h3>
                        <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                            A közösség segítségével az elveszett állatod hamarosan visszakerülhet hozzád. Kövesd nyomon a jelentéseket és kapcsolódj a megtalálókkal.
                        </p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className={`${theme === "dark" ? "bg-gradient-to-r from-gray-800 to-gray-900" : "bg-gradient-to-r from-[#64B6FF] to-[#A7D8FF]"} py-12 md:py-24`}>
                <div className="container mx-auto px-4 text-center">
                    <h2 className={`text-2xl md:text-4xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Csatlakozz Most!</h2>
                    <p className={`text-sm md:text-2xl mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        Regisztrálj az ÁllatRadar-ra, és segíts az elveszett állatok hazatalálásában.
                    </p>
                    <button className={`${theme === "dark" ? "bg-white hover:bg-gray-100 text-gray-900" : "bg-[#073F48] hover:bg-[#052a32] text-white"} font-semibold py-3 px-8 rounded-full transition duration-300 shadow-lg text-sm md:text-base`}>
                        <Link to={"/regisztracio"}>Regisztrálj most</Link>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
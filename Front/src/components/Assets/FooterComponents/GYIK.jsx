import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';

const GYIK = () => {
  const { theme } = useTheme();

  return (
    <div className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-gradient-to-r from-[#64B6FF] to-[#A7D8FF] text-[#073F48]"} min-h-screen pt-24 py-12 px-4 sm:px-6 lg:px-8`}>
      <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} max-w-4xl mx-auto shadow-lg rounded-lg p-6 sm:p-8`}>
      <h1 className={`text-3xl sm:text-4xl font-bold text-center ${theme === "dark" ? "text-white" : "text-gray-900"} mb-8`}>
  Gyakran Ismételt Kérdések
</h1>

        {/* Mi az ÁllatRadar? */}
        <div className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-50 text-gray-600"} mb-8 p-6 rounded-lg shadow-sm`}>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            Mi az ÁllatRadar?
          </h2>
          <p className="text-sm sm:text-base">
            Az ÁllatRadar egy platform és közösség, amelynek célja az elveszett háziállatok és gazdáik újraegyesítése. Felhasználóink ingyen létrehozhatnak riasztást weboldalunkon vagy mobilalkalmazásunkon keresztül. A Rescue Squad™ gyorsan terjeszti a hírt, és növeli az elveszett állatok megtalálásának esélyét.
          </p>
        </div>

        {/* Ingyen használható? */}
        <div className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-50 text-gray-600"} mb-8 p-6 rounded-lg shadow-sm`}>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            Ingyen használható?
          </h2>
          <p className="text-sm sm:text-base">
            Igen, az elveszett vagy megtalált állatok bejelentése az ÁllatRadaron ingyenes. Azonban opcionális prémium szolgáltatásokat is kínálunk, amelyekkel növelheted a riasztásod láthatóságát és elérését.
          </p>
        </div>

        {/* Működik? */}
        <div className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-50 text-gray-600"} mb-8 p-6 rounded-lg shadow-sm`}>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            Működik?
          </h2>
          <p className="text-sm sm:text-base">
            Igen, az ÁllatRadar hatékonyan segít az elveszett háziállatok és gazdáik újraegyesítésében. Bár a sikerességi ráta függhet olyan tényezőktől, mint a riasztás gyorsasága vagy a közösség reakciókészsége, sok háziállat tulajdonosnak sikerült már megtalálnia elveszett kedvencét az ÁllatRadar segítségével.
          </p>
        </div>

        {/* Mi az ÁllatRadar riasztás? */}
        <div className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-50 text-gray-600"} mb-8 p-6 rounded-lg shadow-sm`}>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            Mi az ÁllatRadar riasztás?
          </h2>
          <p className="text-sm sm:text-base">
            Az ÁllatRadar riasztás olyan, mint egy AMBER riasztás, de elveszett vagy megtalált háziállatokra. A riasztások célja, hogy gyorsan terjesztsék az információt az elveszett vagy megtalált állatokról, kihasználva a közösségi média és a közösség erejét a sikeres újraegyesítés érdekében.
          </p>
        </div>

        {/* További kérdések? */}
        <div className="text-center mt-12">
          <p className={`${theme === "dark" ? "text-white" : "text-gray-600"} text-sm sm:text-base mb-4`}>
            További kérdéseid vannak? Lépj kapcsolatba velünk!
          </p>
          <button className={`${theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-[#64B6FF] hover:bg-[#52a8f5] text-white"} font-semibold py-2 px-6 rounded-full transition duration-300 shadow-lg`}>
            <Link to={"/kapcsolat"}>Kapcsolat</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GYIK;
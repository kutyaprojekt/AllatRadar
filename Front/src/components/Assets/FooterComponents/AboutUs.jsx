import React from 'react';
import { useTheme } from '@/context/ThemeContext';

const AboutUs = () => {
  const { theme } = useTheme();

  return (
    <div className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-gradient-to-r from-[#64B6FF] to-[#A7D8FF] text-[#073F48]"} min-h-screen pt-24 py-12 px-4 sm:px-6 lg:px-8`}>
      <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} max-w-4xl mx-auto shadow-lg rounded-lg p-6 sm:p-8`}>
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
          Rólunk
        </h1>

        {/* Az ÁllatRadar célja */}
        <div className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-50 text-gray-600"} mb-8 p-6 rounded-lg shadow-sm`}>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            Mi az ÁllatRadar?
          </h2>
          <p className="text-sm sm:text-base">
            Az ÁllatRadar nem csupán egy weboldal vagy alkalmazás – egy közösség és egy cél: az elveszett háziállatok és gazdáik újraegyesítése. Hiszünk abban, hogy minden állatnak otthonra és szerető gazdára van szüksége, és hogy együtt könnyebben megtaláljuk az elveszett kedvenceket. Az ÁllatRadar segítségével gyorsan és hatékonyan terjesztheted az információt, ha az állatod elveszett, vagy ha megtaláltál egy elveszett állatot.
          </p>
        </div>

        {/* A csapatunk */}
        <div className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-50 text-gray-600"} mb-8 p-6 rounded-lg shadow-sm`}>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            A csapatunk
          </h2>
          <p className="text-sm sm:text-base">
            Az ÁllatRadar mögött három szenvedélyes programozó áll, akik úgy döntöttek, hogy tehetségüket és energiájukat egy értelmes cél érdekében használják fel. A csapatunk tagjai:
          </p>
          <ul className="list-disc list-inside mt-2">
            <li><strong>Sóki Zalán</strong> - A frontend varázsló, aki az oldal designjáért és felhasználói élményéért felel.</li>
            <li><strong>Bodrogi Zétény</strong> -  A backend mestere, aki biztosítja, hogy az oldal gyorsan és megbízhatóan működjön.</li>
            <li><strong>Páskuj Csaba</strong> - A projektmenedzser, aki összetartja a csapatot és gondoskodik arról, hogy minden zökkenőmentesen menjen.</li>
          </ul>
          <p className="text-sm sm:text-base mt-4">
            Együtt hoztuk létre az ÁllatRadart, hogy segítsünk azoknak, akik elvesztették kedvencüket. Hiszünk abban, hogy a technológia nem csupán az életünket könnyíti meg, hanem segíthet mások életét is jobbá tenni.
          </p>
        </div>

        {/* Miért jó az ÁllatRadar? */}
        <div className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-50 text-gray-600"} mb-8 p-6 rounded-lg shadow-sm`}>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            Miért jó az ÁllatRadar?
          </h2>
          <p className="text-sm sm:text-base">
            Az ÁllatRadar nem csupán egy eszköz – egy közösség, amely összefog, hogy segítsen. Ha az állatod elveszett, itt találsz rá gyorsan segítséget. Ha megtaláltál egy elveszett állatot, itt könnyedén megtalálhatod a gazdáját. Az ÁllatRadar célja, hogy minden állat biztonságban legyen, és minden gazdi mosolyogjon.
          </p>
        </div>

        {/* További információk */}
        <div className="text-center mt-12">
          <p className={`${theme === "dark" ? "text-white" : "text-gray-600"} text-sm sm:text-base mb-4`}>
            További kérdéseid vannak? Lépj kapcsolatba velünk!
          </p>
          <button className={`${theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-[#64B6FF] hover:bg-[#52a8f5] text-white"} font-semibold py-2 px-6 rounded-full transition duration-300 shadow-lg`}>
            Kapcsolat
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
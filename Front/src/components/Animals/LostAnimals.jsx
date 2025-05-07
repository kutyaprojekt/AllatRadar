import LostAnimalTemplate from "./LostAnimalTemplate";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const LostAnimals = () => {
    const [animals, setAnimals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const { theme } = useTheme();

    const loadAnimals = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("http://localhost:8000/felhasznalok/osszeselveszett", {
                method: 'GET',
                headers: {
                    "Content-type": "application/json",
                }
            });

            if (!response.ok) {
                throw new Error("Hiba történt az adatok lekérése során");
            }

            const data = await response.json();
            const validAnimals = data.filter(animal =>
                animal &&
                animal.id &&
                animal.allatfaj &&
                typeof animal.allatfaj === 'string' &&
                animal.elutasitva !== true
            );

            // Állatok rendezése jóváhagyás és dátum szerint
            const sortedAnimals = validAnimals.sort((a, b) => {
                // Először jóváhagyott állatok
                if (a.elutasitva === "false" && b.elutasitva !== "false") return -1;
                if (a.elutasitva !== "false" && b.elutasitva === "false") return 1;

                // Majd dátum szerint (újabb először)
                return new Date(b.datum) - new Date(a.datum);
            });

            setAnimals(sortedAnimals);
        } catch (error) {
            // Hiba kezelése
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAnimals();
        window.scrollTo(0, 0);
    }, []);

    const filteredAnimals = animals.filter(animal =>
        animal.allatfaj.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (animal.leiras && animal.leiras.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className={`min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-[#f0fdff] to-[#e0e3fe] text-[#0c4a6e]'}`}>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold sm:text-5xl mb-4">
                        <span className={theme === 'dark' ? 'text-white' : 'text-[#075985]'}>Elveszett </span>
                        <span className={`bg-clip-text text-transparent bg-gradient-to-r ${theme === 'dark' ? 'from-cyan-400 to-blue-500' : 'from-cyan-600 to-blue-700'}`}>Állatok</span>
                    </h1>
                    <p className={`text-lg max-w-3xl mx-auto ${theme === 'dark' ? 'text-cyan-100' : 'text-cyan-900'}`}>
                        Segíts, hogy visszakerüljenek a gazdájukhoz
                    </p>
                </div>

                <div className="max-w-2xl mx-auto mb-8 px-4">
                    <div className="relative shadow-lg rounded-xl">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Keresés állatfaj vagy leírás alapján..."
                            className={`block w-full pl-12 pr-4 py-3 text-base rounded-xl focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-gray-800 text-white placeholder-cyan-300 focus:ring-cyan-500' : 'bg-white text-cyan-900 placeholder-cyan-500 focus:ring-cyan-500'}`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="flex flex-col items-center">
                            <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${theme === 'dark' ? 'border-cyan-400' : 'border-cyan-600'}`}></div>
                            <p className={`mt-3 ${theme === 'dark' ? 'text-cyan-300' : 'text-cyan-700'}`}>Állatok betöltése...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-6 px-2">
                            <div>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${theme === 'dark' ? 'bg-gray-800 text-cyan-400' : 'bg-white text-cyan-700 shadow-sm'}`}>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                    </svg>
                                    Összes elveszett állat
                                </span>
                            </div>
                            <div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold ${theme === 'dark' ? 'bg-cyan-800 text-cyan-100' : 'bg-cyan-100 text-cyan-800'}`}>
                                    {filteredAnimals.length} találat
                                </span>
                            </div>
                        </div>

                        {filteredAnimals.length > 0 ? (
                            <div className="w-full">
                                <div className="flex flex-wrap justify-center gap-6">
                                    {filteredAnimals.map((animal) => (
                                        <div key={animal.id}>
                                            <LostAnimalTemplate animal={animal} theme={theme} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className={`text-center py-12 px-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800/90 text-cyan-100' : 'bg-white/90 text-cyan-900 shadow-md'}`}>
                                <svg className="mx-auto h-12 w-12 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <h3 className={`mt-3 text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-cyan-900'}`}>Nincs találat</h3>
                                <p className={`mt-2 max-w-md mx-auto ${theme === 'dark' ? 'text-cyan-200' : 'text-cyan-700'}`}>
                                    Próbálj meg más kulcsszavakat használni a kereséshez
                                </p>
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className={`mt-4 px-4 py-2 rounded-lg font-medium transition-all ${theme === 'dark' ? 'bg-cyan-600 hover:bg-cyan-500 text-white' : 'bg-cyan-100 hover:bg-cyan-200 text-cyan-800'}`}
                                >
                                    Összes állat megjelenítése
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default LostAnimals;
import LostAnimalTemplate from "./LostAnimalTemplate";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const LostAnimals = () => {
    const [animals, setAnimals] = useState([]);
    const [filteredAnimals, setFilteredAnimals] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const { theme } = useTheme();

    useEffect(() => {
        window.scrollTo(0, 0);
        loadAnimals();
    }, []);

    const loadAnimals = async () => {
        const response = await fetch("http://localhost:8000/felhasznalok/osszallat", {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
            }
        });
        const data = await response.json();
        
        // Sort animals by approval status and date - approved animals first, then sorted by date
        const sortedAnimals = data.sort((a, b) => {
            // First sort by approval status (approved animals first)
            if (a.elutasitva === "false" && b.elutasitva !== "false") return -1;
            if (a.elutasitva !== "false" && b.elutasitva === "false") return 1;
            
            // Then sort by date (newest first)
            return new Date(b.datum) - new Date(a.datum);
        });
        
        setAnimals(sortedAnimals);
        setFilteredAnimals(sortedAnimals);
    }

    useEffect(() => {
        const filtered = animals.filter(animal => {
            return animal.allatfaj.toLowerCase().includes(searchTerm.toLowerCase());
        });
        setFilteredAnimals(filtered);
    }, [searchTerm, animals]);

    return (
        <div className={`${theme === "dark" ? "bg-gray-800" : "bg-[#F0EDEE]"} py-8 md:py-20 min-h-screen`}>
            <div className="container mx-auto px-4">
                <h2 className={`text-2xl md:text-4xl font-bold text-center ${theme === "dark" ? "text-white" : "text-[#073F48]"} mb-6 md:mb-16`}>
                    Elveszett Állatok
                </h2>
                <p className={`text-center mb-8 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                    Segíts, hogy visszakerüljön a családjához!
                </p>

                <div className="flex flex-col items-center mb-6 w-full">
                    <div className="flex flex-col sm:flex-row gap-4 mb-4 w-full max-w-2xl">
                        <input
                            type="text"
                            placeholder="Keresés faj alapján..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`p-2 border-2 rounded-lg focus:outline-none focus:ring-2 text-lg w-full ${theme === "dark"
                                ? "bg-gray-700 border-gray-600 focus:ring-gray-500 text-white"
                                : "bg-white border-[#63E2C6] focus:ring-[#5ABCB9] text-[#074F57]"
                                }`}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                    {filteredAnimals.map((animal) => (
                        <div key={animal.id} className="w-[350px]">
                            <LostAnimalTemplate animal={animal} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default LostAnimals;
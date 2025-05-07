import React from 'react';
import { useTheme } from "../../context/ThemeContext";
import { FaPaw, FaCalendarAlt, FaMapMarkerAlt, FaEdit, FaEye } from 'react-icons/fa';

const AdminPanelPostsTemplate = ({ animal, onEdit, onView }) => {
  const { theme } = useTheme();

  // Hosszú szöveg rövidítése
  const truncateText = (text, maxLength = 30) => {
    if (!text) return "-";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className={`relative flex flex-col rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all ${theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
      }`}>

      <div className="w-full h-48 overflow-hidden">
        {animal.filePath ? (
          <img
            src={`http://localhost:8000/${animal.filePath}`}
            alt={animal.allatfaj}
            className="w-full h-full object-cover"
            onError={(e) => e.target.style.display = 'none'}
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"
            }`}>
            <FaPaw className={`text-4xl ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`} />
          </div>
        )}


        <div className="absolute top-2 left-2">
          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${animal.elutasitva === "true"
            ? theme === "dark" ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-800"
            : animal.elutasitva === "false"
              ? theme === "dark" ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-800"
              : theme === "dark" ? "bg-yellow-900/30 text-yellow-400" : "bg-yellow-100 text-yellow-800"
            }`}>
            {animal.elutasitva === "true"
              ? "Elutasítva"
              : animal.elutasitva === "false"
                ? "Jóváhagyva"
                : "Jóváhagyásra vár"}
          </span>
        </div>
      </div>

      <div className="p-4 flex-1">
        <h3 className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
          {animal.allatfaj}
        </h3>

        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <FaCalendarAlt className={`mr-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
            <span className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
              {animal.datum || "Nincs dátum"}
            </span>
          </div>

          <div className="flex items-center text-sm">
            <FaMapMarkerAlt className={`mr-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
            <span className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
              {truncateText(animal.helyszin)}
            </span>
          </div>

          <div className={`mt-2 py-1 px-2 rounded ${theme === "dark" ? "bg-gray-700/50" : "bg-gray-100"}`}>
            <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              {animal.user?.username ? `Beküldő: ${animal.user.username}` : "Nincs beküldő"}
            </span>
          </div>
        </div>
      </div>

      <div className={`flex divide-x ${theme === "dark" ? "border-t border-gray-700 divide-gray-700" : "border-t border-gray-200 divide-gray-200"
        }`}>
        <button
          onClick={() => onView(animal)}
          className={`flex-1 py-2 flex items-center justify-center gap-2 ${theme === "dark"
            ? "text-gray-300 hover:bg-gray-700"
            : "text-gray-600 hover:bg-gray-50"
            } transition-colors`}
        >
          <FaEye />
          <span className="text-sm">Megtekintés</span>
        </button>

        <button
          onClick={() => onEdit(animal)}
          className={`flex-1 py-2 flex items-center justify-center gap-2 ${theme === "dark"
            ? "text-blue-400 hover:bg-gray-700"
            : "text-blue-600 hover:bg-gray-50"
            } transition-colors`}
        >
          <FaEdit />
          <span className="text-sm">Szerkesztés</span>
        </button>
      </div>
    </div>
  );
};

export default AdminPanelPostsTemplate;

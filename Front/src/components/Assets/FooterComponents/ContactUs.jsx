import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

const ContactUs = () => {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) {
        throw new Error('Üzenet küldése sikertelen');
      }

      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      // Hiba kezelés
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-gradient-to-b from-[#f0fdff] to-[#e0e3fe] text-[#073F48]"} min-h-screen pt-24 py-12 px-4 sm:px-6 lg:px-8`}>
      <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} max-w-4xl mx-auto shadow-lg rounded-lg p-6 sm:p-8`}>
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
          Kapcsolat
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-50 text-gray-600"} p-6 rounded-lg shadow-sm`}>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              Kapcsolati információk
            </h2>
            <div className="space-y-4">
              <p className="text-sm sm:text-base">
                <strong>Email:</strong> info@allatradar.hu
              </p>
              <p className="text-sm sm:text-base">
                <strong>Telefon:</strong> +36 30 123 4567
              </p>
              <p className="text-sm sm:text-base">
                <strong>Cím:</strong> 1234 Budapest, Példa utca 123.
              </p>
            </div>
          </div>

          <div className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-50 text-gray-600"} p-6 rounded-lg shadow-sm`}>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              Küldj üzenetet
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Név</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg ${theme === "dark" ? "bg-gray-600 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"} border focus:outline-none focus:ring-2 focus:ring-[#64B6FF]`}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg ${theme === "dark" ? "bg-gray-600 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"} border focus:outline-none focus:ring-2 focus:ring-[#64B6FF]`}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Üzenet</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="4"
                  className={`w-full px-4 py-2 rounded-lg ${theme === "dark" ? "bg-gray-600 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"} border focus:outline-none focus:ring-2 focus:ring-[#64B6FF]`}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 rounded-lg font-semibold transition duration-300 ${
                  theme === "dark"
                    ? "bg-[#64B6FF] hover:bg-[#52a8f5] text-white"
                    : "bg-[#64B6FF] hover:bg-[#52a8f5] text-white"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? "Küldés..." : "Üzenet küldése"}
              </button>
            </form>
            {success && (
              <p className="mt-4 text-green-500 text-center">
                Üzeneted sikeresen elküldve!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
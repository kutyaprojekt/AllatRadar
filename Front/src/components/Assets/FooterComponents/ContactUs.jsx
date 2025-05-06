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
      console.error('Hiba történt:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-gradient-to-r from-[#64B6FF] to-[#A7D8FF] text-[#073F48]"} min-h-screen pt-24 py-12 px-4 sm:px-6 lg:px-8`}>
      <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} max-w-4xl mx-auto shadow-lg rounded-lg p-6 sm:p-8`}>
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
          Kapcsolat
        </h1>

        {/* Elérhetőségi információk */}
        <div className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-50 text-gray-600"} mb-8 p-6 rounded-lg shadow-sm`}>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            Elérhetőség
          </h2>
          <div className="space-y-4">
            <p className="text-sm sm:text-base">
              <strong>Email:</strong> info@allatradar.hu
            </p>
            <p className="text-sm sm:text-base">
              <strong>Telefonszám:</strong> +36 30 123 4567
            </p>
            <p className="text-sm sm:text-base">
              <strong>Cím:</strong> 1234 Budapest, Állatkereső utca 5.
            </p>
          </div>
        </div>

        {/* Kapcsolatfelvételi űrlap */}
        <div className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-50 text-gray-600"} mb-8 p-6 rounded-lg shadow-sm`}>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            Küldj üzenetet
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Név
              </label>
              <input
                type="text"
                id="name"
                className={`w-full p-2 rounded-lg ${theme === "dark" ? "bg-gray-600 text-white" : "bg-white text-gray-900"} border ${theme === "dark" ? "border-gray-500" : "border-gray-300"}`}
                placeholder="Add meg a neved"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className={`w-full p-2 rounded-lg ${theme === "dark" ? "bg-gray-600 text-white" : "bg-white text-gray-900"} border ${theme === "dark" ? "border-gray-500" : "border-gray-300"}`}
                placeholder="Add meg az email címed"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Üzenet
              </label>
              <textarea
                id="message"
                rows="4"
                className={`w-full p-2 rounded-lg ${theme === "dark" ? "bg-gray-600 text-white" : "bg-white text-gray-900"} border ${theme === "dark" ? "border-gray-500" : "border-gray-300"}`}
                placeholder="Írd ide az üzeneted"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className={`${theme === "dark" ? "bg-gray-600 hover:bg-gray-500 text-white" : "bg-[#64B6FF] hover:bg-[#52a8f5] text-white"} font-semibold py-2 px-6 rounded-full transition duration-300 shadow-lg`}
              disabled={loading}
            >
              {loading ? 'Küldés...' : 'Üzenet küldése'}
            </button>
            {success && <p className="text-green-500 text-sm mt-2">Üzenet sikeresen elküldve!</p>}
          </form>
        </div>

        {/* Térkép */}
        <div className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-50 text-gray-600"} mb-8 p-6 rounded-lg shadow-sm`}>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            Hol találsz minket?
          </h2>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2695.597257665907!2d19.040215315626893!3d47.49853597917758!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4741dcf6f5b7c8c9%3A0x8f6b8b8b8b8b8b8b!2sBudapest%2C%20%C3%81llatkeres%C5%91%20utca%205%2C%201234!5e0!3m2!1shu!2shu!4v1631234567890!5m2!1shu!2shu"
              className="w-full h-full rounded-lg"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
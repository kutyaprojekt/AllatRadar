import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPanelUsersTemplate = ({ user, onShowModal }) => {
    const modalId = `my_modal_${user.id}`; // Egyedi modal azonosító
    const [email, setEmail] = useState(user.email); // Állapot az e-mail cím tárolására
    const [username, setUsername] = useState(user.username); // Állapot a felhasználónév tárolására
    const [password, setPassword] = useState(''); // Állapot a jelszó tárolására
    const [showPasswordField, setShowPasswordField] = useState(false); // Állapot a jelszó mező megjelenítéséhez

    const handleEmailChange = (e) => {
        setEmail(e.target.value); // Frissíti az állapotot, amikor az e-mail cím változik
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value); // Frissíti az állapotot, amikor a felhasználónév változik
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value); // Frissíti az állapotot, amikor a jelszó változik
    };

    const handleSubmit = async () => {
        try {
            // Küldjük a módosított adatokat a szerverre
            const response = await fetch(`http://localhost:8000/felhasznalok/${user.id}/update`, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ email, username, password }), // Küldjük az új adatokat
            });

            if (response.ok) {
                // Sikeresen frissített adatok esetén
                setCurrentUsers(currentUsers => currentUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
                toast.success("Felhasználó adatai sikeresen frissítve!");
            } else {
                console.error("Hiba történt a mentés során");
            }
        } catch (error) {
            console.error("Hiba történt a mentés során:", error);
        }
    };

    return (
        <div className="card bg-base-100 w-96 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">{user.username}</h2>
                <p>{user.email}</p>

                {/* Modal gomb és tartalom */}
                <button className="btn btn-info" onClick={() => onShowModal(modalId)}>
                    Szerkesztés
                </button>
                <dialog id={modalId} className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">{user.username} adatai</h3>

                        {/* E-mail cím mező */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">E-mail cím</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered"
                                value={email}
                                onChange={handleEmailChange}
                            />
                        </div>

                        {/* Felhasználónév mező */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Felhasználónéav</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered"
                                value={username}
                                onChange={handleUsernameChange}
                            />
                        </div>

                        {/* Jelszó mező */}
                        {showPasswordField && (
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Új jelszó</span>
                                </label>
                                <input
                                    type="password"
                                    className="input input-bordered"
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                            </div>
                        )}

                        {/* Jelszó módosítása gomb */}
                        <button
                            className="btn btn-sm btn-outline mt-3"
                            onClick={() => setShowPasswordField(!showPasswordField)}
                        >
                            {showPasswordField ? "Jelszó mező elrejtése" : "Jelszó módosítása"}
                        </button>

                        {/* Modal gombok */}
                        <div className="modal-action">
                            <form method="dialog">
                                <button className="btn">Close</button>
                            </form>
                            <button className="btn" onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                </dialog>
            </div>
            <ToastContainer position="bottom-right" />
        </div>
    );
};

export default AdminPanelUsersTemplate;
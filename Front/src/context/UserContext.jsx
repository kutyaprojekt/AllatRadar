import { createContext, useContext, useState, useEffect } from 'react';
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [refresh, SetRefresh] = useState(false);
    const [user, setUser] = useState({});
    const [hasRejectedPosts, setHasRejectedPosts] = useState(false);
    const token = localStorage.getItem('usertoken');

    // Lekérem a felhasználót
    const getCurrentUser = async (token) => {
        const response = await fetch('http://localhost:8000/felhasznalok/me', {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        setUser(data); // Frissíti a felhasználói adatokat
    };

    // Ellenőrizzük az elutasított posztokat
    const checkRejectedPosts = async () => {
        try {
            const response = await fetch('http://localhost:8000/felhasznalok/rejected-posts', {
                method: 'GET',
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            setHasRejectedPosts(data.length > 0);
        } catch (error) {
            console.error("Hiba az elutasított posztok ellenőrzése során:", error);
        }
    };

    // Mindig lefut, amikor betölt a komponens
    // Oldal reload esetén is le fog futni
    useEffect(() => {
        if (token) {
            getCurrentUser(token);
            checkRejectedPosts();
        }
    }, [refresh]); // A refresh változására is reagál

    return (
        <UserContext.Provider value={{
            refresh,
            SetRefresh,
            user,
            setUser, // Hozzáadva a setUser függvény
            getCurrentUser,
            hasRejectedPosts,
            setHasRejectedPosts,
            checkRejectedPosts
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
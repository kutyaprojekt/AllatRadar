import { createContext, useContext, useState, useEffect } from 'react';
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [refresh, SetRefresh] = useState(false);
    const [user, setUser] = useState(null);
    const [hasRejectedPosts, setHasRejectedPosts] = useState(false);
    const token = localStorage.getItem('usertoken');

    // Felhasználó adatok lekérése
    const getCurrentUser = async (token) => {
        try {
            const response = await fetch('http://localhost:8000/felhasznalok/me', {
                method: 'GET',
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else {
                // If token is invalid, clear it
                localStorage.removeItem('usertoken');
                setUser(null);
            }
        } catch (error) {
            localStorage.removeItem('usertoken');
            setUser(null);
        }
    };

    // Elutasított posztok ellenőrzése
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
            // Hiba az elutasított posztok ellenőrzése során
            setHasRejectedPosts(false);
        }
    };

    // Komponens betöltéskor és állapotváltozáskor
    useEffect(() => {
        if (token) {
            getCurrentUser(token);
            checkRejectedPosts();
        } else {
            setUser(null);
        }
    }, [refresh]);

    return (
        <UserContext.Provider value={{
            refresh,
            SetRefresh,
            user,
            setUser,
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
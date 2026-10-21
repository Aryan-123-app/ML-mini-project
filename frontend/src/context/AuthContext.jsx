import { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import { API_BASE_URL } from "../apiConfig";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const u = localStorage.getItem("ts_user");
        return u ? JSON.parse(u) : null;
    });
    const [watchlist, setWatchlist]       = useState([]);
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    const token = () => localStorage.getItem("ts_token");

    const login = (userData, tok) => {
        localStorage.setItem("ts_token", tok);
        localStorage.setItem("ts_user", JSON.stringify(userData));
        setUser(userData);
        setLoginModalOpen(false);
        fetchWatchlist(tok);
    };

    const logout = () => {
        localStorage.removeItem("ts_token");
        localStorage.removeItem("ts_user");
        setUser(null);
        setWatchlist([]);
    };

    const openLogin = () => setLoginModalOpen(true);
    const closeLogin = () => setLoginModalOpen(false);

    const fetchWatchlist = useCallback(async (tok) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/auth/watchlist`, {
                headers: { Authorization: `Bearer ${tok || token()}` }
            });
            setWatchlist(res.data.watchlist || []);
        } catch { setWatchlist([]); }
    }, []);

    const addToWatchlist = async (symbol) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/auth/watchlist/add`,
                { symbol },
                { headers: { Authorization: `Bearer ${token()}` } }
            );
            setWatchlist(res.data.watchlist);
        } catch (err) { console.error("Watchlist add error:", err); }
    };

    const removeFromWatchlist = async (symbol) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/auth/watchlist/remove`,
                { symbol },
                { headers: { Authorization: `Bearer ${token()}` } }
            );
            setWatchlist(res.data.watchlist);
        } catch (err) { console.error("Watchlist remove error:", err); }
    };

    // Load watchlist on mount if already logged in
    useState(() => {
        if (token()) fetchWatchlist();
    });

    return (
        <AuthContext.Provider value={{ user, watchlist, login, logout, openLogin, closeLogin, loginModalOpen, addToWatchlist, removeFromWatchlist, fetchWatchlist }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

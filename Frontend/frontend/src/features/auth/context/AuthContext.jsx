import {
    createContext,
    useContext,
    useEffect,
    useState,
    } from "react";

    import {
    getMe,
    login as loginApi,
    logout as logoutApi,
    } from "../api/authApi";

    const AuthContext = createContext(null);

    export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!user;

    const initializeAuth = async () => {
        const token = localStorage.getItem("access");

        if (!token) {
        setLoading(false);
        return;
        }

        try {
        const userData = await getMe();
        setUser(userData);
        } catch (error) {
        console.error(error);

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        setUser(null);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        initializeAuth();
    }, []);

    const login = async (credentials) => {
        const tokens = await loginApi(credentials);

        localStorage.setItem(
            "access",
            tokens.access
        );

        localStorage.setItem(
            "refresh",
            tokens.refresh
        );

        const userData = await getMe();

        setUser(userData);

        return userData;
    };

    const logout = () => {
        logoutApi();
        setUser(null);
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
        {children}
        </AuthContext.Provider>
    );
    };

    export const useAuth = () => {
    return useContext(AuthContext);
};
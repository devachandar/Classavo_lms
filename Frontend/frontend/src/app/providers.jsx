import { AuthProvider } from "../features/auth/context/AuthContext";

const Providers = ({ children }) => {
    return (
        <AuthProvider>
        {children}
        </AuthProvider>
    );
};

export default Providers;
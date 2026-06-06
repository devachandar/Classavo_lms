import api from "../../../api/axios";
import { AUTH_ENDPOINTS } from "../../../api/endpoints";

export const login = async (credentials) => {
    const response = await api.post(
        AUTH_ENDPOINTS.LOGIN,
        credentials
    );

    return response.data;
    };

    export const register = async (userData) => {
    const response = await api.post(
        AUTH_ENDPOINTS.REGISTER,
        userData
    );

    return response.data;
    };

    export const getMe = async () => {
    const response = await api.get(
        AUTH_ENDPOINTS.ME
    );

    return response.data;
    };

    export const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
};
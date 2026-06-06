import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
    },
});


// REQUEST INTERCEPTOR

api.interceptors.request.use(
    (config) => {

        const access =
            localStorage.getItem(
                "access"
            );

        if (access) {

            config.headers.Authorization =
                `Bearer ${access}`;

        }

        return config;

    },
    (error) => Promise.reject(error)
);


// RESPONSE INTERCEPTOR

api.interceptors.response.use(

    (response) => response,

    async (error) => {

        const originalRequest =
            error.config;

        const refresh =
            localStorage.getItem(
                "refresh"
            );

        // ACCESS TOKEN EXPIRED

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {

            originalRequest._retry = true;

            // NO REFRESH TOKEN

            if (!refresh) {

                localStorage.removeItem(
                    "access"
                );

                localStorage.removeItem(
                    "refresh"
                );

                window.location.href =
                    "/login";

                return Promise.reject(
                    error
                );
            }

            try {

                const response =
                    await axios.post(
                        "http://localhost:8000/api/auth/token/refresh/",
                        {
                            refresh,
                        }
                    );

                const newAccess =
                    response.data.access;

                localStorage.setItem(
                    "access",
                    newAccess
                );

                originalRequest.headers.Authorization =
                    `Bearer ${newAccess}`;

                return api(
                    originalRequest
                );

            } catch (refreshError) {

                // REFRESH TOKEN EXPIRED

                localStorage.removeItem(
                    "access"
                );

                localStorage.removeItem(
                    "refresh"
                );

                window.location.href =
                    "/login";

                return Promise.reject(
                    refreshError
                );
            }
        }

        return Promise.reject(
            error
        );
    }
);

export default api;
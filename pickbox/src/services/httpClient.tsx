import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';


const backendRoute = axios.create({
    baseURL,
    withCredentials: true
})

// Interceptor para capturar erros 401 (Unauthorized)
backendRoute.interceptors.response.use(
    (response) => response,
    (error) => {
        // Se receber 401, o middleware vai redirecionar para signin
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            // O middleware do Next.js vai detectar a falta de token e redirecionar
            // Aqui apenas propagamos o erro
        }
        return Promise.reject(error);
    }
);

export { backendRoute };
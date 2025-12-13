import axios from "axios"

const axiosInstance=axios.create({
    baseURL:import.meta.env.VITE_API_URL,
    withCredentials:true //nrowser will send the cookies to server automatically to every single req
})

export default axiosInstance
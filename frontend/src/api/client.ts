import axios from "axios"

// Here I define a shared Axios instance for all API requests.
export const api = axios.create({
    baseURL: "http://localhost:8080/api",
})
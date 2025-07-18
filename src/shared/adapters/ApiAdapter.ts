import { TokenStorage } from "../services"

export const apiFetch = async (url: string, options: RequestInit = {}): Promise<Response> =>{
    const token = TokenStorage.getToken();

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
    const config: RequestInit = {
        ...options,
        headers
    }
    return fetch(url, config)
}
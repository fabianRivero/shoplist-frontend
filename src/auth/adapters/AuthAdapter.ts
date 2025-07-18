import { apiFetch } from "../../shared/adapters/ApiAdapter";

export class AuthAdapter {
    private BASE_URL = "http://localhost:3000";

    async login(email: string, password: string): Promise<string>{
        const response = await apiFetch(`${this.BASE_URL}/api/users/login`, {
            method: "POST",
            body: JSON.stringify({ email, password })
        })

        const data = await response.json();

        if(!response.ok){
            throw new Error(data.message || "Error de autenticación");
        }

        return data.token;
    }

    async register(email: string, password: string, username: string ): Promise<void>{
        const response = await apiFetch(`${this.BASE_URL}/api/users/register`, {
            method: "POST",
            body: JSON.stringify({ email, password, username })
        })
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || "Error en el registro")   
        }
    }
    
}
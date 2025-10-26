import { apiFetch } from "../../shared/adapters/ApiAdapter";

export class AuthAdapter {
    private BASE_URL = import.meta.env.VITE_APP_BASE_URL;

    async login(email: string, password: string): Promise<string>{
        const response = await apiFetch(`${this.BASE_URL}/api/users/login`, {
            method: "POST",
            body: JSON.stringify({ email, password })
        })

        let data;
        try {
        data = await response.json();
        } catch {
        data = {};
        }

        if(!response.ok){
            throw new Error(data.message || "Error de autenticación");
        }

        return data.token;
    }

    async register(email: string, password: string, username: string ): Promise<void>{
        const response = await apiFetch(`${this.BASE_URL}/api/users/signup`, {
            method: "POST",
            body: JSON.stringify({ email, password, username })
        })

        const data = await response.json();

        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || "Error en el registro")   
        }

        return data.token;
    }

    async setInitialSetup(currency: string, isConfigured: boolean = true): Promise<string>{

        const response = await apiFetch(`${this.BASE_URL}/api/users/update`, {
            method: "PUT",
            body: JSON.stringify({ 
                currency,
                isConfigured 
            })
        })

        let data;
            try {
            data = await response.json();
            } catch {
            data = {};
        }

        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al guardar configuración inicial")   
        }
        return data.token;
    }

    async updateUser(currency?: string, password?: string): Promise<void>{
        const response = await apiFetch(`${this.BASE_URL}/api/users/update`, {
            method: "PUT",
            body: JSON.stringify({ 
                currency,
                password
            })
        })

        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al guardar configuración inicial")   
        }
    }


    async deleteAcount(email: string ): Promise<void>{
        const response = await apiFetch(`${this.BASE_URL}/api/users/delete`, {
            method: "DELETE",
            body: JSON.stringify({ email })
        })
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || "Error en el registro")   
        }
    }
}
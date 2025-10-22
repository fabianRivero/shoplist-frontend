import { jwtDecode } from "jwt-decode";
import { User } from "../../auth/models";

const TokenKey = import.meta.env.VITE_APP_TOKEN_KEY;

export class TokenStorage {
    static getToken(): string | null {
        return localStorage.getItem(TokenKey);
    }
    static setToken(token: string): void {
        if(token === ""){
            throw new Error("Token is empty");
        }
        localStorage.setItem(TokenKey, token);
    }
    static removeToken(): void {
        localStorage.removeItem(TokenKey);
    }
    static decodeToken(token: string): User{
        return jwtDecode<User>(token);
    }
}
import { TokenStorage } from "../../shared/services";
import { AuthAdapter } from "../adapters/AuthAdapter";
import { User } from "../models";

export class AuthService {
    private authAdapter = new AuthAdapter();

    async login(email: string, password: string): Promise<User>{
        const token = await this.authAdapter.login(email, password);
        TokenStorage.setToken(token);
        const user: User = TokenStorage.decodeToken(token);
        return user;
    }

    async register(email: string, password: string, username: string): Promise<void>{
        await this.authAdapter.register(email, password, username);
    }

    logout(): void {
        TokenStorage.removeToken();
    }

    getUser(): User | null {
        const token = TokenStorage.getToken();
        if (token) {
            try{
                return TokenStorage.decodeToken(token);
            } catch (error) {
                console.error("token invalido", error);
                TokenStorage.removeToken();
                return null;
            }
        }
        return null;
    }
}
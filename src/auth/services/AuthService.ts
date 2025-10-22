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

    async logout(): Promise<void> {
        TokenStorage.removeToken();
    }

    async setInitialSetup(currency: string): Promise<void> {
        await this.authAdapter.setInitialSetup(currency);
    }

    async updateUser(currency?: string, password?: string): Promise<void> {
        await this.authAdapter.updateUser(currency, password);
    }

    async deleteAcount(email: string): Promise<void> {
        await this.authAdapter.deleteAcount(email);
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
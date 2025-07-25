import { createContext } from "react";
import { AuthAction, AuthState } from "../models";


const initialState: AuthState = {
    isAuthenticated: false,
    user: null
};

export const AuthContext = createContext<{
    state: AuthState;
    dispatch: React.Dispatch<AuthAction>;
}>({
    state: initialState,
    dispatch: () => null
});
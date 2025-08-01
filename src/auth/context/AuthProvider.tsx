import { ReactNode, useEffect, useReducer } from "react";
import { AuthActionType, AuthAction, AuthState, User } from "../models";
import { TokenStorage } from "../../shared/services";
import { AuthContext } from "./AuthContext";

const initialState: AuthState = {
    isAuthenticated: false,
    user: null
};

const authContext = AuthContext;

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch(action.type){
        case AuthActionType.LOGIN:
            return{isAuthenticated: true, user: action.payload}
        case AuthActionType.LOGOUT:
            return initialState;
        default: return state;
    }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const token = TokenStorage.getToken();
        if(token){
            try{
                const user: User = TokenStorage.decodeToken(token);
                dispatch({ type: AuthActionType.LOGIN, payload: user });
            } catch (error){
                console.error("Token invalido", error);
                TokenStorage.removeToken();
            }
        }
    }, [])
    return(
        <authContext.Provider value={{ state, dispatch }}>{children}</authContext.Provider>
    )
}
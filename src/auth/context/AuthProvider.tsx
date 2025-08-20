import { ReactNode, useEffect, useReducer } from "react";
import { AuthActionType, AuthAction, AuthState, User } from "../models";
import { TokenStorage } from "../../shared/services";
import { AuthContext } from "./AuthContext";

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: true
};

const authContext = AuthContext;

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch(action.type){
        case AuthActionType.LOGIN:
            return{ isAuthenticated: true, user: action.payload, loading: false }
        case AuthActionType.LOGOUT:
            return { ...initialState, loading: false } 
        case AuthActionType.LOADED:
            return { ...state, loading: false }
        default: 
        return state;
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
                dispatch({ type: AuthActionType.LOADED, payload: false });
            }
        } else {
            dispatch({ type: AuthActionType.LOADED, payload: false });
        }
    }, [])
    return(
        <authContext.Provider value={{ state, dispatch }}>{children}</authContext.Provider>
    )
}
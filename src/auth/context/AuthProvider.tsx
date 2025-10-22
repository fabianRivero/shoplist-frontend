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
            return{ isAuthenticated: true, loading: false, user: action.payload }

        case AuthActionType.LOGOUT:
            return { isAuthenticated: false, user: null, loading: false };

        case AuthActionType.UPDATE:
            return { isAuthenticated: true, loading: false, user: action.payload };

        case AuthActionType.LOADED:
            return { ...state, loading: false }

        case AuthActionType.DELETE_ACOUNT:
            return { isAuthenticated: false, user: null, loading: false };

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
                dispatch({ type: AuthActionType.LOADED, payload: false });
            } catch (error){
                console.error("Token invalido", error);
                dispatch({ type: AuthActionType.LOADED, payload: false });
                TokenStorage.removeToken();
            }
        } else {
            dispatch({ type: AuthActionType.LOADED, payload: false });
        }
    }, [])
    return(
        <authContext.Provider value={{ state, dispatch }}>{children}</authContext.Provider>
    )
}
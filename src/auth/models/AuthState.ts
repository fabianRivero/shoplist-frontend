export enum AuthActionType {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  LOADED = "LOADED"  
};

export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}

export interface AuthState { 
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean
}

export type AuthAction = 
  | { type: AuthActionType.LOGIN; payload: User  }
  | { type: AuthActionType.LOADED; payload: boolean }
  | { type: AuthActionType.LOGOUT };
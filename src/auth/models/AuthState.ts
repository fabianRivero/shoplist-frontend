export enum AuthActionType {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  UPDATE = "UPDATE",
  LOADED = "LOADED",
  DELETE_ACOUNT = "DELETE_ACOUNT"  
};

export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    currency: string;
    isConfigured: boolean;
}

export interface AuthState { 
  isAuthenticated: boolean;
  user: User | undefined;
  loading: boolean;
}

export type AuthAction = 
  | { type: AuthActionType.LOGIN; payload: User  }
  | { type: AuthActionType.LOADED; payload: boolean }
  | { type: AuthActionType.UPDATE; payload: User | undefined }
  | { type: AuthActionType.LOGOUT }
  | { type: AuthActionType.DELETE_ACOUNT }
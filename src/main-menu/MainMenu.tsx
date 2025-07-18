import { AuthService } from "../auth/services/AuthService"
import { useContext } from "react";
import { AuthContext } from "../auth/context";
import { AuthActionType } from "../auth/models";

export const MainMenu = () => {
    const { dispatch } = useContext(AuthContext);

    const logout = async () => {
        try{
            const authService = new AuthService();
            await authService.logout();
            dispatch({ type: AuthActionType.LOGOUT });
        }catch (error){
            if(error instanceof Error){
                alert(error.message || "Error al cerrar sesión");
            }
        }
        
    }

    return(
        <div>
            <h1>Main Menu</h1>
            <button onClick={logout}>Cerrar Sesión</button>
        </div>
    )
}
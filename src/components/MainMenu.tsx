import { AuthService } from "../auth/services/AuthService"
import { useContext } from "react";
import { AuthContext } from "../auth/context";
import { AuthActionType } from "../auth/models";
import { useNavigate } from "react-router-dom";

export const MainMenu = () => {
    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

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

    const goToItems = async () => {
        navigate("/item-list")
    }

    return(
        <div>
            <h1>Main Menu</h1>
            <button onClick={logout}>Cerrar Sesión</button>
            <button onClick={goToItems}>Productos</button>
        </div>
    )
}
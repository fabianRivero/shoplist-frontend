import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/context";
import { AuthService } from "../../auth/services";
import { AuthActionType } from "../../auth/models";

interface Props {
    cls: string;
    isFromMenu?: boolean;
    onLinkClick?: () => void;
}


export const LinkList = ({ cls, isFromMenu = false, onLinkClick }: Props) =>{

    const navigate = useNavigate();
    const { state, dispatch } = useContext(AuthContext);
    
    const logout = async () => {
        try{
            const authService = new AuthService();
            await authService.logout();
            dispatch({ type: AuthActionType.LOGOUT });
            if(isFromMenu) onLinkClick?.();
        }catch (error){
            if(error instanceof Error){
                alert(error.message || "Error al cerrar sesión");
            }
        }
    }

    const goToMenu = async () => {
        navigate("/main-menu")
        if(isFromMenu) onLinkClick?.();
    }

    const goToItems = async () => {
        navigate("/item-list")
        if(isFromMenu) onLinkClick?.();
    }

    const goToBudgetPlanning = async () => {
        navigate("/budget-planning")
        if(isFromMenu) onLinkClick?.();
    }

    useEffect(() => {
        if(!state.isAuthenticated) {
        dispatch({ type: AuthActionType.LOGOUT });
        logout();
        navigate("/");
        }
    }, [state, dispatch]);


    return(
        <nav className={cls}>
            <button className="link-button" onClick={logout}>Cerrar Sesión</button>
            <button className="link-button" onClick={goToMenu}>Menú</button>
            <button className="link-button" onClick={goToItems}>Productos</button>
            <button className="link-button" onClick={goToBudgetPlanning}>Establecer Presupuestos</button>
        </nav>
    )

}


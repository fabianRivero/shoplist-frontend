import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/context";
import { AuthService } from "../../auth/services";
import { AuthActionType } from "../../auth/models";
import { ModalContext } from "../../shared/components/modal/context";

interface Props {
    cls: string;
    isFromMenu?: boolean;
    onLinkClick?: () => void;
}


export const LinkList = ({ cls, isFromMenu = false, onLinkClick }: Props) =>{

    const navigate = useNavigate();
    const { state, dispatch } = useContext(AuthContext);
    const { setState: modalSetState } = useContext(ModalContext);

    const logout = async () => {
        try{
            const authService = new AuthService();
            await authService.logout();
            dispatch({ type: AuthActionType.LOGOUT });
            if(isFromMenu) onLinkClick?.();
            modalSetState({ open: false , data: undefined})
        }catch (error){
            if(error instanceof Error){
                alert(error.message || "Error al cerrar sesión");
            }
        }
    }

    const goToMenu = async () => {
        navigate("/main-menu")
        if(isFromMenu) onLinkClick?.();
        modalSetState({ open: false , data: undefined})
    }

    const goToItems = async () => {
        navigate("/item-list")
        if(isFromMenu) onLinkClick?.();
        modalSetState({ open: false , data: undefined})
    }

    const goToBudgetPlanning = async () => {
        navigate("/budget-planning")
        if(isFromMenu) onLinkClick?.();
        modalSetState({ open: false , data: undefined})
    }

    const goToPurchaseManager = async () => {
        navigate("/purchase-manager")
        if(isFromMenu) onLinkClick?.();
        modalSetState({ open: false , data: undefined})
    }

    const goToAnalyzer = async () => {
        navigate("/analyzer")
        if(isFromMenu) onLinkClick?.();
        modalSetState({ open: false , data: undefined})
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
            <button className="link-button" onClick={goToMenu}>Menú</button>
            <button className="link-button" onClick={goToItems}>Productos</button>
            <button className="link-button" onClick={goToBudgetPlanning}>Establecer Presupuestos</button>
            <button className="link-button" onClick={goToPurchaseManager}>Planifiacar compras</button>
            <button className="link-button" onClick={goToAnalyzer}>Analisis de compras</button>
        </nav>
    )

}


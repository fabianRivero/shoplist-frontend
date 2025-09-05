import { ReactNode, useContext, useEffect } from "react";
import { AuthActionType } from "../../auth/models";
import { AuthService } from "../../auth/services";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/context";

interface Props {
    children: ReactNode;
}

export const Header = ({ children }: Props) => {
    const navigate = useNavigate();
    const { state, dispatch } = useContext(AuthContext);
    
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

    const goToMenu = async () => {
        navigate("/main-menu")
    }

    const goToItems = async () => {
        navigate("/item-list")
    }

    const goToBudgetPlanning = async () => {
        navigate("/budget-planning")
    }

    useEffect(() => {
        if(!state.isAuthenticated) {
        dispatch({ type: AuthActionType.LOGOUT });
        logout();
        navigate("/");
        }
    }, [state, dispatch]);

    return(
        <>
            <header>
                <div>LOGO</div>
                <nav>
                    <button onClick={logout}>Cerrar Sesión</button>
                    <button onClick={goToMenu}>Menú</button>
                    <button onClick={goToItems}>Productos</button>
                    <button onClick={goToBudgetPlanning}>Planificación de Presupuestos</button>
                </nav>
            </header>
            {children}
        </>
    )
}
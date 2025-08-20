import { AuthService } from "../auth/services/AuthService"
import { useContext, useEffect } from "react";
import { AuthContext } from "../auth/context";
import { AuthActionType } from "../auth/models";
import { useNavigate } from "react-router-dom";
import { ShopListContainer } from "./shop-list/ShopListContainer";

export const MainMenu = () => {
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

    const goToItems = async () => {
        navigate("/item-list")
    }
    
    useEffect(() => {
        if(!state.isAuthenticated) {
        navigate("/");
        }

    }, [state.isAuthenticated, navigate]);

    return(
        <>
            <header>
                <div>LOGO</div>
                <nav>
                    <button onClick={logout}>Cerrar Sesión</button>
                    <button onClick={goToItems}>Productos</button>    
                </nav>
            </header>
           
            <main>
                <section>
                    <h2>Compras de hoy</h2>
                    <ShopListContainer/>
                </section>
            </main>
        </>
    )
}
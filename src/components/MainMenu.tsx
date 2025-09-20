import { ShopListContainer } from "./shop-list/ShopListContainer";
import { SummaryContainer } from "./summary/SummaryContainer";
import { useNavigate } from "react-router-dom";
import "./main-menu.scss";

export const MainMenu = () => {

    const navigate = useNavigate();

    const addPurchase = () => {
    navigate("/item-list");
    }

    const goToBudgets = () => {
        navigate("/budget-planning")
    }

    return(
        <main className="main-menu">
            <section className="menu-section">
                <div className="summary-header">
                    <h2>Compras de hoy</h2>
                    <button onClick={addPurchase}>Agregar compra</button>
                </div>

                <ShopListContainer period="day"/>
            </section>

            <section className="menu-section">
                <div className="summary-header">
                    <h2>Resumen de este mes</h2>
                    <div>
                        <button>Gestionar compras</button>
                        <button onClick={goToBudgets}>Gestionar presupuestos</button>
                    </div>
                </div>                   

                <SummaryContainer />
            </section>
        </main>
    )
}
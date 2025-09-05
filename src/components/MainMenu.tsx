import { ShopListContainer } from "./shop-list/ShopListContainer";
import { SummaryContainer } from "./summary/SummaryContainer";

export const MainMenu = () => {

    return(
        <>
            <main>
                <section>
                    <h2>Compras de hoy</h2>
                    <ShopListContainer period="day" mode="editable"/>
                </section>

                <section>
                    <h2>Resumen de este mes</h2>
                    <SummaryContainer />
                </section>
            </main>
        </>
    )
}
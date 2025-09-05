import { useCallback, useContext, useEffect, useState } from "react";
import { purchaseService } from "./services/shopListService";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../shared/hooks/useAxios";
import { PurchaseActionType } from "./models/purchaseListState";
import { PurchaseContext } from "./context/ShopListContext";
import { PurchaseList } from "./components/PurchaseList";
import { getPeriodPurchasesResponse } from "./models/shopListModel";

type Props = {
    period?: string;
    baseDate?: string;
    mode: "editable" | "resume";
}

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");
const localDate = `${year}-${month}-${day}`;

export const ShopListContainer = ({period = "day", baseDate = localDate, mode}: Props) => {
    const { state, dispatch } = useContext(PurchaseContext)
    const navigate = useNavigate();
    const [visibleCount, setVisibleCount] = useState(5);

    const serviceCall = useCallback(() => purchaseService.getPurchasesByCharacteristic(period, baseDate), [period, baseDate])

    const { isLoading, data: register, error } = useAxios<void, getPeriodPurchasesResponse>({
        serviceCall,
        trigger: true
    })

    const addPurchase = () => {
        navigate("/item-list")
    }

    const purchaseArray = state ? Array.from(state.purchases.values()).flat() : [];
    const visiblePurchases = purchaseArray.slice(0, visibleCount);

    useEffect(() => {
        if(register){
            dispatch({ type: PurchaseActionType.NEW, payload: register.register.logs })
        }
    }, [register, dispatch])

    if(isLoading) return <p>Cargando productos...</p>
    if(error) return <p>Error: {error}</p>
    
    return(
        <> 
            <div>
                Fecha: {baseDate}
            </div>

            {purchaseArray.length > 0 ? (
                <>
                    <PurchaseList purchases={visiblePurchases} date={baseDate} />
                    {visibleCount < purchaseArray.length && (
                        <button onClick={() => setVisibleCount(prev => prev + 5)}>
                            Mostrar más
                        </button>
                    )}
                    {visibleCount > purchaseArray.length && (
                        <button onClick={() => setVisibleCount(prev => prev - 5)}>
                            Mostrar menos
                        </button>
                    )}
                </>
            ) : (
                <div>No hay compras registradas</div>
            )}
            {mode === "editable" && (
                <button onClick={addPurchase}>Agregar compra</button>
            )}
        </>
    )
}
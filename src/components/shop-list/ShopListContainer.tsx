import { useCallback, useContext, useEffect, useState } from "react";
import { purchaseService } from "./services/shopListService";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../shared/hooks/useAxios";
import { PurchaseActionType } from "./models/purchaseListState";
import { PurchaseContext } from "./context/ShopListContext";
import { PurchaseList } from "./components/PurchaseList";
import { getPeriodPurchasesResponse } from "./models/shopListModel";

export const ShopListContainer = () => {
    const { state, dispatch } = useContext(PurchaseContext)
    const navigate = useNavigate();
    const [visibleCount, setVisibleCount] = useState(5);
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const localDate = `${year}-${month}-${day}`;
    const [selectedDate, setSelectedDate] = useState(localDate);


    const serviceCall = useCallback(() => purchaseService.getPurchasesByCharacteristic("day", selectedDate), [selectedDate])

    const { isLoading, data: register, error } = useAxios<void, getPeriodPurchasesResponse>({
        serviceCall,
        trigger: true
    })

    const addPurchase = () => {
        navigate("/item-list")
    }

    useEffect(() => {
        if(register){
            dispatch({ type: PurchaseActionType.NEW, payload: register.register.logs })
        }
    }, [register, dispatch])

    const purchaseArray = state ? Array.from(state.purchases.values()).flat() : [];
    const visiblePurchases = purchaseArray.slice(0, visibleCount);

    if(isLoading) return <p>Cargando productos...</p>
    if(error) return <p>Error: {error}</p>
    
    return(
        <> 
            <div style={{ marginBottom: "1rem" }}>
                <label>
                Fecha:{" "}
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
                </label>
            </div>

            {purchaseArray.length > 0 ? (
                <>
                    <PurchaseList purchases={visiblePurchases} date={selectedDate} />
                    {visibleCount < purchaseArray.length && (
                        <button onClick={() => setVisibleCount(prev => prev + 5)}>
                            Mostrar más
                        </button>
                    )}
                </>
            ) : (
                <div>No hay compras registradas</div>
            )}
            <button onClick={addPurchase}>Agregar compra</button>
        </>
    )
}
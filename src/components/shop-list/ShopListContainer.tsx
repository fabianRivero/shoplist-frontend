import { useCallback, useContext, useEffect, useState } from "react";
import { purchaseService } from "./services/shopListService";
import { useAxios } from "../../shared/hooks/useAxios";
import { PurchaseActionType } from "./models/purchaseListState";
import { PurchaseContext } from "./context/ShopListContext";
import { PurchaseList } from "./components/PurchaseList";
import { getPeriodPurchasesResponse } from "./models/shopListModel";
import { motion, AnimatePresence } from "framer-motion";
import "./shop-list-container.scss";
import { normalizeDate } from "../../shared/adapters/dateAdapter";
import { Modal } from "../../shared/components/modal/Modal";
import { PurchaseForm } from "./components/PurchaseForm";
import { ModalContext } from "../../shared/components/modal/context";

type Props = {
    period?: string;
    baseDate?: string;
}

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");
const localDate = `${year}-${month}-${day}`;

export const ShopListContainer = ({period = "day", baseDate = localDate}: Props) => {
    const { state, dispatch } = useContext(PurchaseContext)
    const [visibleCount, setVisibleCount] = useState(3);
    const { state: modalState } = useContext(ModalContext);

    const serviceCall = useCallback(() => purchaseService.getPurchasesByCharacteristic(period, baseDate), [period, baseDate])

    const { isLoading, data: register, error } = useAxios<void, getPeriodPurchasesResponse>({
        serviceCall,
        trigger: true
    })

    const usedDate = baseDate.slice(0, 16) + "00:00:00" + baseDate.slice(24)

    const purchasesForDate = state.purchases.get(normalizeDate(usedDate)) ?? [];
    
    const visiblePurchases = purchasesForDate.slice(0, visibleCount);

    useEffect(() => {
        if (register){
            if (register.register.logs.length > 0) {
                dispatch({ type: PurchaseActionType.NEW, payload: register.register.logs[0] })
            }
        } 
    }, [register, dispatch])


    if(isLoading) return <p>Cargando productos...</p>
    if(error) return <p>Error: {error}</p>
    
    return(
    <>
        <div className="purchase-list-container"> 
            
            <h3 className="date">Fecha: {normalizeDate(baseDate)}</h3>
            
            {purchasesForDate.length > 0 ? (
                <>
                    <div className="purchase-list-wrapper">
                        <AnimatePresence initial={false}>
                            {visiblePurchases.map(purchase => (
                                <motion.div
                                    key={purchase.purchaseId}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <PurchaseList purchases={[purchase]} date={usedDate} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {visibleCount < purchasesForDate.length && (
                        <button onClick={() => setVisibleCount(prev => prev + 3)} className="show-button">
                            Mostrar más
                        </button>
                    )}
                    {visibleCount > 3 &&  (
                        <button onClick={() => setVisibleCount(prev => prev - 3)} className="show-button">
                            Mostrar menos
                        </button>
                    )}
                </>
            ) : (
                <h3 className="not-found-message">No hay compras registradas</h3>
            )}
        </div>
        
        <Modal>
        {modalState.data?.content === "purchase" && <PurchaseForm mode="edit" />}
        </Modal>
    </>
    )
}

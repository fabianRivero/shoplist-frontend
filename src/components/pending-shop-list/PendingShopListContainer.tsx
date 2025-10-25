import { useCallback, useContext, useEffect } from "react"
import { PendingItemContext } from "./context/pendingItem"
import { PendingItemList } from "./components/PendingItemList"
import { useAxios } from "../../shared/hooks/useAxios"
import { Modal } from "../../shared/components/modal/Modal"
import { useNavigate } from "react-router-dom"
import "./pending-shop-items-container.scss"
import { pendingItemsService } from "./services/pendingItemService"
import { pendingItem, PendingItemActionType } from "./models"
import { PendingItemForm } from "./components/PendingItemForm"

export const PendingShopListContainer = () => {
    const { state, dispatch } = useContext(PendingItemContext)
    const navigate = useNavigate();

    const serviceCall = useCallback(() => pendingItemsService.getItems(), [])
    const { isLoading, data: items, error } = useAxios<void, pendingItem[]>({
        serviceCall,
        trigger: true
    })

    const goBack = () => {
        navigate(-1);
    };

    const goToProducts = () => {
        navigate("/item-list");
    };

    useEffect(() => {
        if(items && items.length > 0){
            dispatch({ type: PendingItemActionType.GET_ITEMS, payload: items })
        }
    }, [items, dispatch])

    if(isLoading) return <p>Cargando productos...</p>
    if(error) return <p>Error: {error}</p>

    const itemsArray = Array.from(state.pendingItems, (([, value]) => value))
    const sortedArray = itemsArray.sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }))
    return(
        <main className="pending-items-container">
            <div className="buttons">
                <button 
                    onClick={() => goToProducts()} 
                    className="pending-item-button"
                >
                    Agregar productos
                </button>

                <button 
                    onClick={() => goBack()} 
                    className="pending-item-button"
                >
                    Volver
                </button>
            </div>
            
            <div className="products">
                {state && state.pendingItems.size > 0 ?
                <PendingItemList items={sortedArray} />
                :
                <div className="not-found-message">No hay productos pendientes.</div>
                }
            </div>

      <Modal>
            <PendingItemForm />        
      </Modal>
        </main>
    )
}
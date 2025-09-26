import { useCallback, useContext, useEffect } from "react"
import { shopItemsService } from "./services/shopItemService"
import { ShopItemContext } from "./context/shopItem"
import { shopItem, ShopItemActionType } from "./models"
import { ShopItemList } from "./components/ShopItemList"
import { ShopItemForm } from "./components/ShopItemForm"
import { ModalContext } from "../../shared/components/modal/context"
import { useAxios } from "../../shared/hooks/useAxios"
import { Modal } from "../../shared/components/modal/Modal"
import { useNavigate } from "react-router-dom"
import "./shop-items-container.scss"
import { PurchaseForm } from "../shop-list/components/PurchaseForm"

export const ShopItemsContainer = () => {
    const serviceCall = useCallback(() => shopItemsService.getItems(), [])
    const { state: modalState, setState } = useContext(ModalContext);
    const { state, dispatch } = useContext(ShopItemContext)
    const navigate = useNavigate();

    const { isLoading, data: items, error } = useAxios<void, shopItem[]>({
        serviceCall,
        trigger: true
    })

    const openModal = () => {
        setState({
        open: true,
        data: { mode: "create", form: "shopItem" },
        });
    };

    const goBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        if(items && items.length > 0){
            dispatch({ type: ShopItemActionType.NEW, payload: items })
        }
    }, [items, dispatch])

    if(isLoading) return <p>Cargando productos...</p>
    if(error) return <p>Error: {error}</p>
    
    return(
        <main className="shop-items-container">
            <div className="buttons">
                <button onClick={openModal} className="shop-item-button">Crear nuevo producto</button>
                <button 
                    onClick={() => goBack()} 
                    className="shop-item-button"
                >
                    Volver
                </button>
            </div>
            
            {state && state.items.size > 0 ?
            <ShopItemList items={Array.from(state.items, (([, value]) => value))} />
            :
            <div className="not-found-message">No hay productos registrados</div>
            }

      <Modal>

        {modalState.data?.form === "shopItem" && <ShopItemForm isModal/>}
        {modalState.data?.form === "purchase" && 
        (modalState.data.mode === "create" ?
            <PurchaseForm mode="create" /> :
            <PurchaseForm mode="edit" />
        )
        
       }
      </Modal>
        </main>
    )
}
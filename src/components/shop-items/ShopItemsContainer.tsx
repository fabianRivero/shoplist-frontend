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


export const ShopItemsContainer = () => {
    const serviceCall = useCallback(() => shopItemsService.getItems(), [])
    const { setState } = useContext(ModalContext)
    const { state, dispatch } = useContext(ShopItemContext)
    const navigate = useNavigate();


    const { isLoading, data: items, error } = useAxios<void, shopItem[]>({
        serviceCall,
        trigger: true
    })

    const openModal = () => {
        setState(true)

    }

    const backToMenu = () => {
        navigate("/main-menu")
    }

    useEffect(() => {
        if(items && items.length > 0){
            dispatch({ type: ShopItemActionType.NEW, payload: items })
        }
    }, [items, dispatch])

    if(isLoading) return <p>Cargando productos...</p>
    if(error) return <p>Error: {error}</p>
    
    return(
        <main className="shop-items-container">
            {state && state.items.size > 0 ?
            <ShopItemList items={Array.from(state.items, (([, value]) => value))} />
            :
            <div className="not-found-message">No hay productos registrados</div>
            }
            <div className="buttons">
                <button onClick={openModal} className="shop-item-button">Crear nuevo producto</button>
                <button onClick={backToMenu} className="shop-item-button">Volver al menú principal</button>
            </div>
            <Modal>
                <ShopItemForm isModal/>
            </Modal>
        </main>
    )
}
import { useCallback, useContext } from "react";
import { shopItem, ShopItemActionType } from "../models";
import { ShopItemContext } from "../context/shopItem";
import { shopItemsService } from "../services/shopItemService";
import { ShopItem } from "./ShopItem";
import { useAxios } from "../../../shared/hooks/useAxios";
import { ModalContext } from "../../../shared/components/modal/context";
import  "./styles/shop-item-list.scss";

interface Props {
    items: shopItem[],
}

export const ShopItemList = ({ items }: Props) => {
    const { dispatch } = useContext(ShopItemContext);
    const { setState: modalSetState } = useContext(ModalContext);

    const deleteItemServiceCall = useCallback((id: string) => shopItemsService.deleteItem(id), [])

    const { error: deleteError, executeFetch: executeDeleteItemFetch } = useAxios<string, void>({
        serviceCall: deleteItemServiceCall
    })

    const handleDelete = async (id: string) => {
        executeDeleteItemFetch(id)
        if(!deleteError){
            dispatch({
                type: ShopItemActionType.DELETE_ITEM,
                payload: id
            })

        }
    }

    const handleEdit = (id: string) => {
        modalSetState({
            open: true,
            data: { id, mode: "edit", form: "shopItem" }
        });
    }

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const newPurchase = (id: string) => {
        const date = getTodayDate();
        modalSetState({
            open: true,
            data: { id, date, mode: "create", form: "purchase" }
        });
    }

    return(
        <main className="shop-item-list-container">
            <h1>Lista de productos</h1>
            <ul className="shop-item-list">
                {
                items.map((item) => (
                    <ShopItem key={item.id} shopItem={item}>
                        <div className="buttons">
                            <button className="shop-item-button" onClick={() => handleDelete(item.id)}>Eliminar</button>
                            <button className="shop-item-button" onClick={() => handleEdit(item.id)}>Editar</button>
                            <button className="shop-item-button" onClick={() => newPurchase(item.id)}>Agregar compra</button>
                        </div>
                    </ShopItem>
                ))
            }</ul>
        </main>
    )
}
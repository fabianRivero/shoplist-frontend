import { useCallback, useContext } from "react";
import { pendingItem, PendingItemActionType } from "../models";
import { PendingItemContext } from "../context/pendingItem";
import { pendingItemsService } from "../services/pendingItemService";
import { useAxios } from "../../../shared/hooks/useAxios";
import { ModalContext } from "../../../shared/components/modal/context";
import  "./styles/pending-item-list.scss";
import { getMonthNumber } from "../../../shared/services/getMonthNumber";
import { PendingItem } from "./PendingItem";

interface Props {
    items: pendingItem[],
}

export const PendingItemList = ({ items }: Props) => {
    const { dispatch } = useContext(PendingItemContext);
    const { state: modalState, setState: modalSetState } = useContext(ModalContext);

    const deleteItemServiceCall = useCallback((id: string) => pendingItemsService.deleteItem(id), [])

    const { error: deleteError, executeFetch: executeDeleteItemFetch } = useAxios<string, void>({
        serviceCall: deleteItemServiceCall
    })

    const handleDelete = async (id: string) => {
        executeDeleteItemFetch(id)
        if(!deleteError){
            dispatch({
                type: PendingItemActionType.DELETE_ITEM,
                payload: id
            })

        }
    }

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const usedDate = modalState.data?.date
    const formattedDate = 
    usedDate && usedDate?.length > 10 ?
    usedDate && `${usedDate.slice(11, 15)}-${getMonthNumber(usedDate.slice(4, 7))}-${usedDate.slice(8, 10)}`
    : usedDate;
    
    const newPurchase = (id: string) => {

      const date = formattedDate ? formattedDate : getTodayDate();

      modalSetState({
        open: true,
        data: { id, date, mode: "create", content: "purchase" }
      });
    }

  return (
    <main className="pending-item-list-container">
      <h1>Lista de productos pendientes</h1>
    
      <ul className="pending-item-list">
        {items.map((item) => (
              <PendingItem key={item.productId} pendingItem={item}>
                <div className="buttons">
                  <button className="pending-item-button" onClick={() => handleDelete(item.productId)}>
                    Eliminar
                  </button>
                  <button className="pending-item-button" onClick={() => newPurchase(item.productId)}>
                    Agregar compra
                  </button>
                </div>
              </PendingItem>
        ))}
      </ul>
      
    </main>
  );
}
import { useCallback, useContext, useMemo, useState } from "react";
import { shopItem, ShopItemActionType } from "../models";
import { ShopItemContext } from "../context/shopItem";
import { shopItemsService } from "../services/shopItemService";
import { ShopItem } from "./ShopItem";
import { useAxios } from "../../../shared/hooks/useAxios";
import { ModalContext } from "../../../shared/components/modal/context";
import  "./styles/shop-item-list.scss";
import { getMonthNumber } from "../../../shared/services/getMonthNumber";

interface Props {
    items: shopItem[],
}

export const ShopItemList = ({ items }: Props) => {
    const { dispatch } = useContext(ShopItemContext);
    const { state: modalState, setState: modalSetState } = useContext(ModalContext);
    const [searchTerm, setSearchTerm] = useState("");

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
            data: { id, mode: "edit", content: "shopItem" }
        });
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

    const filteredItems = useMemo(() => {
      const term = searchTerm.toLowerCase().trim();
      if (!term) return items;
      return items.filter((item) => item.name.toLowerCase().includes(term));
    }, [items, searchTerm]);

    const groupedItems = useMemo(() => {
        const groups: Record<string, shopItem[]> = {};

        for (const item of filteredItems) {
            const firstLetter = item.name[0].toUpperCase();
            if (!groups[firstLetter]) {
                groups[firstLetter] = [];
            }
            groups[firstLetter].push(item);
            }

            const sortedEntries = Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
            return sortedEntries;
    }, [filteredItems]);


  return (
    <main className="shop-item-list-container">
      <h1>Lista de productos</h1>
      <input
        type="text"
        placeholder="Buscar producto..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="shop-item-search"
      />
      {groupedItems.length === 0 ? (
        <p className="not-found-message">No se encontraron productos.</p>
      ) : (
        <ul className="shop-item-list">
          {groupedItems.map(([letter, group]) => (
            <li key={letter} className="shop-item-group">
              <h2 className="shop-item-letter">{letter}</h2>
              <ul className="shop-item-list">
                {group.map((item) => (
                  <ShopItem key={item.id} shopItem={item}>
                    <div className="buttons">
                      <button className="shop-item-button" onClick={() => handleDelete(item.id)}>
                        Eliminar
                      </button>
                      <button className="shop-item-button" onClick={() => handleEdit(item.id)}>
                        Editar
                      </button>
                      <button className="shop-item-button" onClick={() => newPurchase(item.id)}>
                        Agregar compra
                      </button>
                    </div>
                  </ShopItem>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}

    </main>
  );
}
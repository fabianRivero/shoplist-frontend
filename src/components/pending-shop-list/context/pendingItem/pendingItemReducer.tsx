import { useEffect, useReducer } from "react";
import { pendingItem, PendingItemAction, PendingItemActionType, PendingItemState } from "../../models";
import { PendingItemContext } from "./PendingItemContext";
import { pendingItemsService } from "../../services/pendingItemService";

const initialState: PendingItemState = {
    pendingItems: new Map()
};

const withClonedItems = (
  pendingItems: Map<string, pendingItem>,
  modifier: (map: Map<string, pendingItem>) => void
): Map<string, pendingItem> => {
  const cloned = new Map(pendingItems);
  modifier(cloned);
  return cloned;
};

const arrayToItemsMap = (items: pendingItem[]): Map<string, pendingItem> =>
  new Map(items.map(item => [item.productId, item]));

const pendingItemReducer = (state: PendingItemState, action: PendingItemAction): PendingItemState => {
    switch (action.type) {
        case PendingItemActionType.GET_ITEMS:
        return {
            ...state,
            pendingItems: arrayToItemsMap(action.payload) 
        };

        case PendingItemActionType.SET_ITEM: {
            if (state.pendingItems.has(action.payload.productId)) {
                console.error("Este item ya existe");
                return state;
            }

            const newItems = withClonedItems(state.pendingItems, map =>
                map.set(action.payload.productId, action.payload)
            );

            return { ...state, pendingItems: newItems };
        }

        case PendingItemActionType.DELETE_ITEM: {
            if (!state.pendingItems.has(action.payload)) {
                console.error("Este item no existe");
                return state;
            }

            const newItems = withClonedItems(state.pendingItems, map =>
                map.delete(action.payload)
            );

            return { ...state, pendingItems: newItems };
        }

        default:
            return state;
    }
}

export const PendingItemProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(pendingItemReducer, initialState);

      useEffect(() => {
        (async () => {
        try {
            const items = await pendingItemsService.getItems();
            dispatch({ type: PendingItemActionType.GET_ITEMS, payload: items });
        } catch (err) {
            console.error("Error cargando items", err);
        }
        })();
    }, []);

    return <PendingItemContext.Provider value={{ state, dispatch }}>{children}</PendingItemContext.Provider>;
};
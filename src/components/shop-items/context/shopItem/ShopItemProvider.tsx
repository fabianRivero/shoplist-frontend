import { useReducer } from "react";
import { shopItem, ShopItemAction, ShopItemActionType, ShopItemState } from "../../models";
import { ShopItemContext } from "./ShopItemContext";

const initialState: ShopItemState = {
    items: new Map()
};

const withClonedItems = (
  items: Map<string, shopItem>,
  modifier: (map: Map<string, shopItem>) => void
): Map<string, shopItem> => {
  const cloned = new Map(items);
  modifier(cloned);
  return cloned;
};

const arrayToItemsMap = (items: shopItem[]): Map<string, shopItem> =>
  new Map(items.map(item => [item.id, item]));

const shopItemReducer = (state: ShopItemState, action: ShopItemAction): ShopItemState => {
    switch (action.type) {
        case ShopItemActionType.NEW:
        return {
            ...state,
            items: arrayToItemsMap(action.payload) 
        };

        case ShopItemActionType.CREATE: {
            if (state.items.has(action.payload.id)) {
                console.error("Este item ya existe");
                return state;
            }

            const newItems = withClonedItems(state.items, map =>
                map.set(action.payload.id, action.payload)
            );

            return { ...state, items: newItems };
        }

        case ShopItemActionType.UPDATE_ITEM: {
            if (!state.items.has(action.payload.id)) {
                console.error("Este item no existe");
                console.log("no pasa ahora", state)
                return state;
            }

            const newItems = withClonedItems(state.items, map =>
                map.set(action.payload.id, action.payload)
            );

            return { ...state, items: newItems };
        }

        case ShopItemActionType.DELETE_ITEM: {
            if (!state.items.has(action.payload)) {
                console.error("Este item no existe");
                return state;
            }

            const newItems = withClonedItems(state.items, map =>
                map.delete(action.payload)
            );

            return { ...state, items: newItems };
        }

        default:
            return state;
    }
}

export const ShopItemProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(shopItemReducer, initialState);

    return <ShopItemContext.Provider value={{ state, dispatch }}>{children}</ShopItemContext.Provider>;
};
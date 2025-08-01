import { createContext } from "react";
import { ShopItemAction, ShopItemState } from "../../models";

const initialState: ShopItemState = {
    items: new Map()
};

export const ShopItemContext = createContext<{
    state: ShopItemState;
    dispatch: React.Dispatch<ShopItemAction>;
}>({
    state: initialState,
    dispatch: () => null
});


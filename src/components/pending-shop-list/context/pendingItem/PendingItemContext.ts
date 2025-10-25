import { createContext } from "react";
import { PendingItemAction, PendingItemState } from "../../models";

const initialState: PendingItemState = {
    pendingItems: new Map()
};

export const PendingItemContext = createContext<{
    state: PendingItemState;
    dispatch: React.Dispatch<PendingItemAction>;
}>({
    state: initialState,
    dispatch: () => null
});


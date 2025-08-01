import React, { createContext } from "react";
import { PurchaseAction, PurchaseState } from "../models/purchaseListState";

const initialState: PurchaseState = {
    purchases: new Map()
}

export const PurchaseContext = createContext<{
    state: PurchaseState;
    dispatch: React.Dispatch<PurchaseAction>
}>({
    state: initialState,
    dispatch: () => null
})


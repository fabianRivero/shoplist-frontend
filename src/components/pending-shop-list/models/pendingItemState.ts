import { pendingItem } from "./pendingItemModel";

export enum PendingItemActionType {
    GET_ITEMS = "GET_ITEMS",
    SET_ITEM = "SET_ITEM",
    DELETE_ITEM = "DELETE_ITEM",
}

export interface PendingItemState {
    pendingItems: Map<string, pendingItem>;
}

export type PendingItemAction =
| { type: PendingItemActionType.GET_ITEMS; payload: pendingItem[] }
| { type: PendingItemActionType.SET_ITEM; payload: pendingItem }
| { type: PendingItemActionType.DELETE_ITEM; payload: string }


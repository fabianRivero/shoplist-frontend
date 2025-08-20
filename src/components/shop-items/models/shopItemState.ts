import { shopItem } from "./shopItemModel";

export enum ShopItemActionType {
    NEW = "NEW",
    SET_ITEM = "SET_ITEM",
    CREATE = "CREATE",
    UPDATE_ITEM = "UPDATE_ITEM",
    DELETE_ITEM = "DELETE_ITEM",
}

export interface ShopItemState {
    items: Map<string, shopItem>;
}

export type ShopItemAction =
| { type: ShopItemActionType.NEW; payload: shopItem[] }
| { type: ShopItemActionType.SET_ITEM; payload: shopItem }
| { type: ShopItemActionType.CREATE; payload: shopItem }
| { type: ShopItemActionType.UPDATE_ITEM; payload: shopItem }
| { type: ShopItemActionType.DELETE_ITEM; payload: string }


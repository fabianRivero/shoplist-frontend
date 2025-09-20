import { Purchase, ShopList } from "./shopListModel";

export enum PurchaseActionType {
    NEW = "NEW",
    MERGE = "MERGE",
    CREATE_PURCHASE = "CREATE_PURCHASE",
    DELETE_PURCHASE = "DELETE_PURCHASE",
    UPDATE_PURCHASE = "UPDATE_PURCHASE",
    GET_PERIOD_PURCHASE = "GET_PERIOD_PURCHASE"
}

export interface PurchaseState {
    purchases: Map<string, Purchase[]>;
}

export type PurchaseAction = 
| { type: PurchaseActionType.NEW; payload: ShopList }
| { type: PurchaseActionType.MERGE; payload: ShopList[] }
| { type: PurchaseActionType.CREATE_PURCHASE; payload: Purchase }
| { type: PurchaseActionType.DELETE_PURCHASE; payload: string }
| { type: PurchaseActionType.UPDATE_PURCHASE; payload: Purchase }
| { type: PurchaseActionType.GET_PERIOD_PURCHASE; payload: ShopList[] }
import { Purchase } from "./shopListModel";

export enum PurchaseActionType {
    NEW = "NEW",
    CREATE_PURCHASE = "CREATE_PURCHASE",
    DELETE_PURCHASE = "DELETE_PURCHASE",
    UPDATE_PURCHASE = "UPDATE_PURCHASE"
}

export interface PurchaseState {
    purchases: Map<string, Purchase>;
}

export type PurchaseAction = 
| { type: PurchaseActionType.NEW; payload: Purchase[] }
| { type: PurchaseActionType.CREATE_PURCHASE; payload: Purchase }
| { type: PurchaseActionType.DELETE_PURCHASE; payload: string }
| { type: PurchaseActionType.UPDATE_PURCHASE; payload: Purchase }

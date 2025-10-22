import { shopItem } from "../../shop-items/models";

export interface Purchase extends Pick<shopItem, 
 "name" | "quantity" | "unit" | "price" | "brand" | "sector"> {
    productId: string;
    purchaseQuantity: number;
    purchaseId?: string;
}

export interface ShopList {
    date: string;
    userId: string;
    purchases: Purchase[];
}

export interface logs {
    logs: ShopList[],
}

export interface getPeriodPurchasesResponse {
    register: logs,
    period: string,
    startDate: string,
    endDate: string
}


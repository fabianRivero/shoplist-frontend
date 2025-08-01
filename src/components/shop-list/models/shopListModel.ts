import { shopItem } from "../../shop-items/models";

export interface Purchase extends Pick<shopItem, 
 "name" | "quantity" | "unit" | "price" | "currency" | "brand" | "sector"> {
    productId: string;
    purchaseQuantity: number;
    purchaseId: string;
}

export interface ShopList {
    userId: string;
    date: string | Date;
    purchases: Purchase[];
}
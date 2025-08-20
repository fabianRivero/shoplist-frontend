export interface shopItem {
    id: string;
    userId: string;
    name: string;
    quantity: number;
    unit: string;
    price: number;
    currency: string;
    brand?: string;
    sector?: string; 
}

export type CreateShopItem = Omit<shopItem, "id">;

export type GetShopItem = {
    item: shopItem;
};
import { getPeriodPurchasesResponse, Purchase, ShopList } from "../models/shopListModel";
import { apiFetch } from "../../../shared/adapters/ApiAdapter";

function getLocalDate(): string {
  return new Date().toLocaleDateString("en-CA"); 
}

function getTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

class PurchaseService {
    private BASE_URL = `${import.meta.env.BASE_URL}/api/purchases`

    async createPurchase(data: ShopList): Promise<Purchase>{
        const response = await apiFetch(`${this.BASE_URL}/`, {
            method: "POST",
            body: JSON.stringify({
                ...data,
                timeZone: getTimeZone() 
            })
        });
        const { item } = await response.json();
        return item;
    }
    
    async deletePurchase(date: string, purchaseId: string | undefined): Promise<void>{
        await apiFetch(`${this.BASE_URL}/${date}`, {
            method: "DELETE",
            body: JSON.stringify({
                purchaseId,
                timeZone: getTimeZone()
            })            
        });
    }

    async updatePurchase(data: ShopList): Promise<Purchase>{
        const response = await apiFetch(`${this.BASE_URL}/${data.date}`, {
            method: "PUT",
            body: JSON.stringify({
                purchaseId: data.purchases[0].purchaseId,
                purchaseQuantity: data.purchases[0].purchaseQuantity,
                price: data.purchases[0].price,
                timeZone: getTimeZone() 
            })
        });
        return response.json();
    }

    async getPurchasesByCharacteristic(
        period: string = "day",
        date: string = getLocalDate(),
        sector?: string
        ): Promise<getPeriodPurchasesResponse> {
        const params = new URLSearchParams({
            period,
            baseDate: date,
            timeZone: getTimeZone(),
            ...(sector ? { sector } : {}),
        });

        const response = await apiFetch(`${this.BASE_URL}/filters?${params.toString()}`, {
            method: "GET",
        });
        const data = await response.json();
        return data;
    }

    async getPurchases(): Promise<ShopList[]> {
        const response = await apiFetch(`${this.BASE_URL}`);
        const { items } = await response.json();
        return items;
    }
}

export const purchaseService = new PurchaseService();
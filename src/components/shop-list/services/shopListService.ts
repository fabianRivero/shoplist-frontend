import axios from "axios";
import { Purchase } from "../models/shopListModel";

class PurchaseService {
    private BASE_URL = "http://localhost:3000"

    async createPurchase(data: Purchase): Promise<Purchase>{
        const response = await axios.post<Purchase>(`${this.BASE_URL}/`, data);
        return response.data;
    }
    
    async deletePurchase(id: string): Promise<void>{
        const response = await axios.delete(`${this.BASE_URL}/${id}`);
        return response.data;
    }

    async updatePurchase(data: Purchase): Promise<Purchase>{
        const response = await axios.put<Purchase>(`${this.BASE_URL}/${data.purchaseId}`, data);
        return response.data;
    }

    async getPurchase(id: string): Promise<Purchase>{
        const response = await axios.get<Purchase>(`${this.BASE_URL}/${id}`);
        return response.data;
    }

    async getPurchases(): Promise<Purchase[]> {
        const response = await axios.get<{ items: Purchase[] }>(`${this.BASE_URL}/api/purchases`);
        return response.data.items;
    }
}

export const purchaseService = new PurchaseService();
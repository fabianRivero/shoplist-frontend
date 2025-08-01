import axios from "axios";
import { CreateShopItem, shopItem, UpdateShopItem } from "../models";

class ShopItemService {
    private BASE_URL = "http://localhost:3000/api/items"

    async createItem(data: CreateShopItem): Promise<shopItem>{
        const response = await axios.post<{ item: shopItem }>(`${this.BASE_URL}/`, data);
        return response.data.item;
    }
    
    async deleteItem(id: string): Promise<void>{
        const response = await axios.delete(`${this.BASE_URL}/${id}`);
        return response.data;
    }

    async updateItem(data: UpdateShopItem): Promise<shopItem>{
        const response = await axios.put<{ item: shopItem }>(`${this.BASE_URL}/${data.id}`, data);
        return response.data.item;
    }

    async getItem(id: string): Promise<shopItem>{
        const response = await axios.get<shopItem>(`${this.BASE_URL}/${id}`);
        return response.data;
    }

    async getItems(): Promise<shopItem[]> {
        const response = await axios.get<{ items: shopItem[] }>(`${this.BASE_URL}`);
        return response.data.items;
    }
}

export const shopItemsService = new ShopItemService();
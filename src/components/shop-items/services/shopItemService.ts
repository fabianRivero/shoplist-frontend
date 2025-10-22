import { apiFetch } from "../../../shared/adapters/ApiAdapter";
import { CreateShopItem, shopItem } from "../models";

class ShopItemService {
  private BASE_URL = `${import.meta.env.VITE_APP_BASE_URL}/api/items`;

  async createItem(data: CreateShopItem): Promise<shopItem> {
    const response = await apiFetch(`${this.BASE_URL}/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    const { item } = await response.json();
    return item;
  }

  async deleteItem(id: string): Promise<void> {
    await apiFetch(`${this.BASE_URL}/${id}`, { method: "DELETE" });
  }

  async updateItem(data: shopItem): Promise<shopItem> {
    const response = await apiFetch(`${this.BASE_URL}/${data.id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    const { item } = await response.json();
    return item;
  }

  async getItem(id: string): Promise<shopItem> {
    const response = await apiFetch(`${this.BASE_URL}/${id}`);
    const { item } = await response.json();
    return item;
  }

  async getItems(): Promise<shopItem[]> {
    const response = await apiFetch(`${this.BASE_URL}`);
    const { items } = await response.json();
    return items;
  }
}

export const shopItemsService = new ShopItemService();

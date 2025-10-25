import { apiFetch } from "../../../shared/adapters/ApiAdapter";
import { pendingItem } from "../models";

class PendingItemService {
  private BASE_URL = `${import.meta.env.VITE_APP_BASE_URL}/api/pending-list`;

  async createItem(data: pendingItem): Promise<pendingItem> {
    const response = await apiFetch(`${this.BASE_URL}/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    const { item } = await response.json();
    return item;
  }

  async deleteItem(id: string): Promise<void> {
    await apiFetch(`${this.BASE_URL}/${id}`, { 
      method: "DELETE",
    });
  }

  async getItem(id: string): Promise<pendingItem> {
    const response = await apiFetch(`${this.BASE_URL}/${id}`);
    const { item } = await response.json();
    return item;
  }

  async getItems(): Promise<pendingItem[]> {
    const response = await apiFetch(`${this.BASE_URL}`);
    const { items } = await response.json();
    return items;
  }
}

export const pendingItemsService = new PendingItemService();

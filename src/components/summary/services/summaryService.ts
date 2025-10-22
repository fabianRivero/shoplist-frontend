import { apiFetch } from "../../../shared/adapters/ApiAdapter";
import { Budget, Summary } from "../models/summaryModel";

class SummaryService {
    private BASE_URL = `${import.meta.env.BASE_URL}/api`;

    async getSummary(date: string, period: string, sector: string = "" ): Promise<Summary> {
        const response = await apiFetch(`${this.BASE_URL}/summary?date=${date}&period=${period}&sector=${sector}`, {
            method: "GET",
        })
        return await response.json();

    }

    async setGeneralBudget(year: number | string, month: number | string, budget: number): Promise<Budget> {
        const response = await apiFetch(`${this.BASE_URL}/generalBudget/${year}/${month}`, {
            method: "PUT",
            body: JSON.stringify({ general: budget }),
        });

        return await response.json();
    }

    async setSectorBudget(year: number | string, month: number | string, sector: string, budget: number): Promise<Budget> {
        const response = await apiFetch(`${this.BASE_URL}/sectorBudget/${year}/${month}/${sector}`, {
            method: "PUT",
            body: JSON.stringify({ budget }),
        });
        return await response.json();
    }

    async deleteGeneralBudget(year: number | string, month: number | string): Promise<Budget> {
        const response = await apiFetch(`${this.BASE_URL}/budgets/${year}/${month}/general`, {
            method: "DELETE"
        })
        return await response.json();
    }

    async deleteSectorBudget(year: number | string, month: number | string, sector: string): Promise<Budget> {
        const response = await apiFetch(`${this.BASE_URL}/budgets/${year}/${month}/sectors/${sector}`, {
            method: "DELETE"
        })
        return await response.json();
    }    

}

export const summaryService = new SummaryService();
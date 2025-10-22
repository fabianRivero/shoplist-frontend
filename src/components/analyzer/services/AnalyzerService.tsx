import { register } from "../models/analyzerModel";
import { apiFetch } from "../../../shared/adapters/ApiAdapter";

class AnalyzerService {
    private BASE_URL = `${import.meta.env.BASE_URL}/api/purchases`

    async getItem(period: string, date: string, sector: string = ""): Promise<register>{
        const response = await apiFetch(`${this.BASE_URL}/filters?period=${period}&baseDate=${date}&sector=${sector}`, {
            method: "GET",
        });
        return await response.json();
    };
}

export const analyzerService = new AnalyzerService();

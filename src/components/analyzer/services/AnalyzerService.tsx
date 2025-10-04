import axios from "axios";
import { register } from "../models/analyzerModel";

class AnalyzerService {
    private BASE_URL = "http://localhost:3000/api/purchases"

    async getItem(period: string, date: string, sector: string = ""): Promise<register>{
        const response = await axios.get<register>(`${this.BASE_URL}/filters?period=${period}&baseDate=${date}&sector=${sector}`);
        return response.data;
    };
}

export const analyzerService = new AnalyzerService();

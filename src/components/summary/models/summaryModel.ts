export interface SectorBudget {
  sector: string;   
  budget?: number;   
  spent: number;    
}

export interface Budget {
  userId: string;
  createdAt: string;
  general: number;            
  month: number;
  year: number;
  sectors: SectorBudget[];    
  updatedAt: string;
}

export interface Summary {
  baseDate: string;                  
  period: "day" | "week" | "month" | "year";
  totalSpent: number;                
  spentBySector: Record<string, number>;
  budgets?: Budget[];
}

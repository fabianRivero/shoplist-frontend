import { Budget } from "../../../models/summaryModel";

export enum BudgetPlanningActionType {
    SET_GENERAL_BUDGET = "CREATE_BUDGET",
    SET_SECTOR_BUDGET = "UPDATE_BUDGET",
    DELETE_GENERAL_BUDGET = "DELETE_GENERAL_BUDGET",
    DELETE_SECTOR_BUDGET = "DELETE_SECTOR_BUDGET",
}

export interface BudgetPlanningState {
    budget: Budget | null;
}
    
export type BudgetPlanningAction =
    | { type: BudgetPlanningActionType.SET_GENERAL_BUDGET; payload: Budget }
    | { type: BudgetPlanningActionType.SET_SECTOR_BUDGET; payload: Budget }
    | { type: BudgetPlanningActionType.DELETE_GENERAL_BUDGET; payload: Budget }
    | { type: BudgetPlanningActionType.DELETE_SECTOR_BUDGET; payload: Budget }
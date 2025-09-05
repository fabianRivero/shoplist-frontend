import { Budget, Summary } from "./summaryModel";

export enum SummaryActionType {
    GET = "GET",
    SET_SECTOR_BUDGET = "SET_SECTOR_BUDGET",
    SET_GENERAL_BUDGET = "SET_GENERAL_BUDGET",
    DELETE_SECTOR_BUDGET = "DELETE_SECTOR_BUDGET",
    DELETE_GENERAL_BUDGET = "DELETE_GENERAL_BUDGET",
    UPDATE_GENERAL_BUDGET = "UPDATE_GENERAL_BUDGET",
    UPDATE_SECTOR_BUDGET = "UPDATE_SECTOR_BUDGET",
}

export interface SummaryState {
     summary: Summary | null;
}

export type SummaryAction = 
| { type: SummaryActionType.GET, payload: Summary | null }
| { type: SummaryActionType.SET_GENERAL_BUDGET; payload: Budget }
| { type: SummaryActionType.SET_SECTOR_BUDGET; payload: Budget }
| { type: SummaryActionType.DELETE_SECTOR_BUDGET, payload: Budget }
| { type: SummaryActionType.DELETE_GENERAL_BUDGET, payload: Budget }
| { type: SummaryActionType.UPDATE_GENERAL_BUDGET, payload: Budget }
| { type: SummaryActionType.UPDATE_SECTOR_BUDGET, payload: Budget }


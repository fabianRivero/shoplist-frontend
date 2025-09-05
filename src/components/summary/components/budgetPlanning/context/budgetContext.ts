import { createContext } from "react";
import { BudgetPlanningAction, BudgetPlanningState } from "../models/budgetPlanningState";

export const initialState: BudgetPlanningState = {
    budget: 0
}

export const BudgetContext = createContext<{
    state: BudgetPlanningState;
    dispatch: React.Dispatch<BudgetPlanningAction>;
}>({
    state: initialState,
    dispatch: () => null
})
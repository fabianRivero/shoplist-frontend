import { useReducer } from "react";
import { BudgetPlanningAction, BudgetPlanningActionType, BudgetPlanningState } from "../models/budgetPlanningState";
import { BudgetContext, initialState } from "./budgetContext";

const BudgetReducer = (state: BudgetPlanningState, action: BudgetPlanningAction): BudgetPlanningState => {
    switch(action.type){
        case BudgetPlanningActionType.SET_GENERAL_BUDGET:
            return state;

        case BudgetPlanningActionType.SET_SECTOR_BUDGET:
            return state;

        case BudgetPlanningActionType.DELETE_GENERAL_BUDGET:
            console.log(state)
            console.log(action.payload)
            return state; 
            
        case BudgetPlanningActionType.DELETE_SECTOR_BUDGET:
            return state; 
            
        default: 
            return state;
    }
}

export const BudgetProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(BudgetReducer, initialState);

    return <BudgetContext.Provider value ={{ state, dispatch }}>{ children }</BudgetContext.Provider>
}
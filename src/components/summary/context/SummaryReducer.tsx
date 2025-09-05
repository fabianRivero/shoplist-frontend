import { ReactNode, useReducer } from "react";
import { SummaryAction, SummaryActionType, SummaryState } from "../models/summaryState";
import { SummaryContext, initialState } from "./summaryContext";
import { Budget } from "../models/summaryModel";

const SummaryReducer = (state: SummaryState, action: SummaryAction): SummaryState => {
    switch (action.type) {
        case SummaryActionType.GET:
            return { ...state, summary: action.payload };

        case SummaryActionType.SET_GENERAL_BUDGET: {
            if (!state.summary) return state;

            const updatedBudget: Budget = action.payload; 
            const updatedBudgets = state.summary.budgets?.map(
                b => b.year === updatedBudget.year && b.month === updatedBudget.month ? 
                updatedBudget : b
            ) || [updatedBudget]
            return {
                ...state,
                summary: {
                    ...state.summary,
                    budgets: updatedBudgets
                }
            };
        }

        case SummaryActionType.SET_SECTOR_BUDGET: {
            if (!state.summary) return state;
            const updatedBudget: Budget = action.payload;
            const updatedBudgets = state.summary.budgets?.map(b =>
                b.year === updatedBudget.year && b.month === updatedBudget.month
                    ? updatedBudget
                    : b
            ) || [updatedBudget];

            return {
                ...state,
                summary: {
                    ...state.summary,
                    budgets: updatedBudgets
                }
            };
        }

        case SummaryActionType.DELETE_GENERAL_BUDGET:
            return {
                ...state,
                summary: state.summary ? {
                    ...state.summary,
                    budgets: state.summary.budgets?.map(b =>
                        b.year === action.payload.year && b.month === action.payload.month ? { ...b, general: 0 } : b
                    )
                } : null
            };

        case SummaryActionType.DELETE_SECTOR_BUDGET: {
            if (!state.summary) return state; 

            const updatedBudget = action.payload;

            const updatedBudgets = state.summary.budgets ? 
                state.summary.budgets.map(b =>
                b.year === updatedBudget.year && b.month === updatedBudget.month ? updatedBudget : b
                )
            : [updatedBudget];

            return {
                ...state,
                summary: {
                ...state.summary,
                budgets: updatedBudgets,
                },
            };
        }

        default:
            return state;
    }
};


export const SummaryProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(SummaryReducer, initialState);

    return (
        <SummaryContext.Provider value={{ state, dispatch }}>
            {children}
        </SummaryContext.Provider>
    );
};
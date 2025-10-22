import { useReducer } from "react";
import { SummaryAction, SummaryActionType, SummaryState } from "../models/summaryState";
import { SummaryContext } from "./summaryContext";

const initialState: SummaryState = {
    summary: null
}

export const SummaryReducer = (state: SummaryState, action: SummaryAction): SummaryState => {
  switch (action.type) {
    case SummaryActionType.GET:
      return { ...state, summary: action.payload };

    case SummaryActionType.SET_GENERAL_BUDGET: {
      if (!state.summary) return state;
      const newBudget = action.payload;

      const exists = state.summary.budgets?.some(
        (b) => b.year === newBudget.year && b.month === newBudget.month
      );

      const updatedBudgets = exists
        ? state.summary.budgets!.map((b) =>
            b.year === newBudget.year && b.month === newBudget.month ? newBudget : b
          )
        : [...(state.summary.budgets || []), newBudget];

      return {
        ...state,
        summary: { ...state.summary, budgets: updatedBudgets },
      };
    }

    case SummaryActionType.UPDATE_GENERAL_BUDGET: {
      if (!state.summary) return state;
      const updated = action.payload;

      const updatedBudgets = state.summary.budgets?.map((b) =>
        b.year === updated.year && b.month === updated.month ? updated : b
      );

      return {
        ...state,
        summary: { ...state.summary, budgets: updatedBudgets },
      };
    }

    case SummaryActionType.DELETE_GENERAL_BUDGET: {
      if (!state.summary) return state;
      const deleted = action.payload;

      const updatedBudgets = state.summary.budgets?.map((b) =>{
        if(b.year === deleted.year && b.month === deleted.month){
          return{
            ...b,
            general: 0,
            sectors: [],
          };
        }
        return b;
      });
      return{
        ...state,
        summary: { ...state.summary, budgets: updatedBudgets },
      }
    }

    case SummaryActionType.SET_SECTOR_BUDGET: {
      if (!state.summary) return state;
      const newBudget = action.payload;

      const exists = state.summary.budgets?.some(
        (b) => b.year === newBudget.year && b.month === newBudget.month
      );

      const updatedBudgets = exists
        ? state.summary.budgets!.map((b) =>
            b.year === newBudget.year && b.month === newBudget.month ? newBudget : b
          )
        : [...(state.summary.budgets || []), newBudget];

      return {
        ...state,
        summary: { ...state.summary, budgets: updatedBudgets },
      };
    }

    case SummaryActionType.UPDATE_SECTOR_BUDGET: {
      if (!state.summary) return state;
      const updated = action.payload;

      const updatedBudgets = state.summary.budgets?.map((b) =>
        b.year === updated.year && b.month === updated.month ? updated : b
      );

      return {
        ...state,
        summary: { ...state.summary, budgets: updatedBudgets },
      };
    }

    case SummaryActionType.DELETE_SECTOR_BUDGET: {
      if (!state.summary) return state;
        const updated = action.payload;

      const updatedBudgets = state.summary.budgets?.map((b) =>
        b.year === updated.year && b.month === updated.month ? updated : b
      );

      return {
        ...state,
        summary: { ...state.summary, budgets: updatedBudgets },
      };
    }

    default:
      return state;
  }
};

export const SummaryProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(SummaryReducer, initialState);

  return <SummaryContext.Provider value = {{ state, dispatch }}>{ children }</SummaryContext.Provider>
}
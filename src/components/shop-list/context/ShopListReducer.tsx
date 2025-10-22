import { useReducer } from "react";
import { PurchaseAction, PurchaseActionType, PurchaseState } from "../models/purchaseListState";
import { Purchase, ShopList } from "../models/shopListModel";
import { PurchaseContext } from "./ShopListContext";
import { normalizeDate } from "../../../shared/adapters/dateAdapter";


const initialState: PurchaseState = {
    purchases: new Map()
}

const arrayToPurchasesMap = (register: ShopList[]): Map<string, Purchase[]> =>
  new Map(
    register
      .filter(item => item.date)
      .map(item => [normalizeDate(item.date), item.purchases])
  );

const PurchaseReducer = (state: PurchaseState, action: PurchaseAction): PurchaseState => {
  switch (action.type) {

    case PurchaseActionType.NEW: {

      const newMap = new Map(state.purchases);

      const normalizedDate = normalizeDate(action.payload.date);
      newMap.set(normalizedDate, action.payload.purchases);

      return { ...state, purchases: newMap };
    }

    case PurchaseActionType.CREATE_PURCHASE: {
      if (!action.payload.purchaseId) return state;

      const date = new Date().toISOString().split("T")[0];
      const newPurchases = new Map(state.purchases);

      const existing = newPurchases.get(date) ?? [];
      newPurchases.set(date, [...existing, action.payload]);

      return { ...state, purchases: newPurchases };
    }

    case PurchaseActionType.UPDATE_PURCHASE: {
      if (!action.payload.purchaseId) return state;

      const newPurchases = new Map(state.purchases);

      for (const [date, list] of newPurchases.entries()) {
        const idx = list.findIndex(p => p.purchaseId === action.payload.purchaseId);
        if (idx !== -1) {
          const updated = [...list];
          updated[idx] = action.payload;
          newPurchases.set(date, updated);
          break;
        }
      }

      return { ...state, purchases: newPurchases };
    }

    case PurchaseActionType.DELETE_PURCHASE: {
      const newPurchases = new Map(state.purchases);

      for (const [date, list] of newPurchases.entries()) {
        const filtered = list.filter(p => p.purchaseId !== action.payload);
        if (filtered.length !== list.length) {
          newPurchases.set(date, filtered);
        }
      }

      return { ...state, purchases: newPurchases };
    }

    case PurchaseActionType.GET_PERIOD_PURCHASE:
      return {
        ...state,
        purchases: arrayToPurchasesMap(action.payload),
      };

      
    case PurchaseActionType.MERGE: {
      const newMap = new Map(state.purchases);
      action.payload.forEach((shopList) => {

      newMap.set(shopList.date, shopList.purchases);
      });
      return { ...state, purchases: newMap };
    }

    default:
      return state;
  }
};

export const PurchaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(PurchaseReducer, initialState);

  return <PurchaseContext.Provider value = {{ state, dispatch }}>{ children }</PurchaseContext.Provider>
}
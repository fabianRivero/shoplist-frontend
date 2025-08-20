import { useReducer } from "react";
import { PurchaseAction, PurchaseActionType, PurchaseState } from "../models/purchaseListState";
import { Purchase, ShopList } from "../models/shopListModel";
import { PurchaseContext } from "./ShopListContext";

const initialState: PurchaseState = {
    purchases: new Map()
}

const withClonedPurchases = (
  items: Map<string | undefined, Purchase[]>,
  modifier: (map: Map<string | undefined, Purchase[]>) => void
): Map<string | undefined, Purchase[]> => {
  const cloned = new Map(items);
  modifier(cloned);
  return cloned;
};

const arrayToPurchasesMap = (register: ShopList[]): Map<string | undefined, Purchase[]> =>
  new Map(register.map(item => [item.date, item.purchases]));

const PurchaseReducer = (state: PurchaseState, action: PurchaseAction): PurchaseState => {
    switch(action.type){
        case PurchaseActionType.NEW: 
        return{
            ...state,
            purchases: arrayToPurchasesMap(action.payload)
        };

      case PurchaseActionType.CREATE_PURCHASE: {
          if (action.payload.purchaseId && state.purchases.has(action.payload.purchaseId)) {
              console.error("Esta compra ya existe");
              return state;
          }

          const newPurchases = withClonedPurchases(state.purchases, map =>
              map.set(action.payload.productId, [action.payload])
          );

          return { ...state, purchases: newPurchases };
      };

      case PurchaseActionType.UPDATE_PURCHASE: {
        if(!state){
          console.error("Esta compra no existe");
          return state
        };

        const newPurchases = withClonedPurchases(state.purchases, map =>
          map.set(action.payload.purchaseId, [action.payload])
        );

        return { ...state, purchases: newPurchases };
      };

      case PurchaseActionType.GET_PERIOD_PURCHASE: {
        return{
            ...state,
            purchases: arrayToPurchasesMap(action.payload)
        };

      }

      case PurchaseActionType.DELETE_PURCHASE: {
        const newPurchases = new Map(state.purchases);
        for(const [date, list] of newPurchases.entries()){
          const filtered = list.filter(purchase => purchase.purchaseId !== action.payload);
          if(filtered.length !== list.length){
            newPurchases.set(date, filtered);
          }
        }
        
        return { ...state, purchases: newPurchases };
      };

      default:
        return state;
    };
};

export const PurchaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(PurchaseReducer, initialState);

  return <PurchaseContext.Provider value = {{ state, dispatch }}>{ children }</PurchaseContext.Provider>
}
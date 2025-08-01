import { useReducer } from "react";
import { PurchaseAction, PurchaseActionType, PurchaseState } from "../models/purchaseListState";
import { Purchase } from "../models/shopListModel";
import { PurchaseContext } from "./ShopListContext";

const initialState: PurchaseState = {
    purchases: new Map()
}

const withClonedPurchases = (
  items: Map<string, Purchase>,
  modifier: (map: Map<string, Purchase>) => void
): Map<string, Purchase> => {
  const cloned = new Map(items);
  modifier(cloned);
  return cloned;
};

const arrayToPurchasesMap = (purchases: Purchase[]): Map<string, Purchase> =>
  new Map(purchases.map(purchase => [purchase.purchaseId, purchase]));

const PruchaseReducer = (state: PurchaseState, action: PurchaseAction): PurchaseState => {
    switch(action.type){
        case PurchaseActionType.NEW:
        return{
            ...state,
            purchases: arrayToPurchasesMap(action.payload)
        };

      case PurchaseActionType.CREATE_PURCHASE: {
          if (state.purchases.has(action.payload.purchaseId)){
              console.error("Esta compra ya existe");
              return state;
          }

          const newPurchases = withClonedPurchases(state.purchases, map =>
              map.set(action.payload.purchaseId, action.payload)
          );

          return { ...state, purchases: newPurchases };
      };

      case PurchaseActionType.UPDATE_PURCHASE: {
        if(!state.purchases.has(action.payload.purchaseId)){
          console.error("Esta compra no existe");
          return state
        };

        const newPurchases = withClonedPurchases(state.purchases, map =>
          map.set(action.payload.purchaseId, action.payload)
        );

        return { ...state, purchases: newPurchases };
      };
    
      case PurchaseActionType.DELETE_PURCHASE: {
        if(!state.purchases.has(action.payload)){
          console.error("Esta compra no exsite");
          return state;
        };

        const newPurchases = withClonedPurchases(state.purchases, map => 
          map.delete(action.payload)
        );

        return { ...state, purchases: newPurchases };
      };

      default:
        return state;
    };
};

export const PurchaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(PruchaseReducer, initialState);

  return <PurchaseContext.Provider value = {{ state, dispatch }}>{ children }</PurchaseContext.Provider>
}
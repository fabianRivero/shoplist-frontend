import { useCallback, useContext } from "react";
import { Purchase } from "../models/shopListModel";
import { PurchaseContext } from "../context/ShopListContext";
import { purchaseService } from "../services/shopListService";
import { useAxios } from "../../../shared/hooks/useAxios";
import { PurchaseActionType } from "../models/purchaseListState";
import { PurchaseItem } from "./PurchaseItem";
import "./styles/purchase-list.scss"
import { ModalContext } from "../../../shared/components/modal/context";

interface Props {
    purchases: Purchase[],
    date: string
};

export const PurchaseList = ({ purchases, date }: Props) => {
    const { dispatch } = useContext(PurchaseContext);
      const { setState: modalSetState } = useContext(ModalContext);

    const deletePurchaseServiceCall = useCallback((id: string | undefined) => purchaseService.deletePurchase(date, id), [date])

    const { executeFetch: executeDeletePurchaseFetch } = useAxios<string, void>({
        serviceCall: deletePurchaseServiceCall
    });

    const handleDelete = async (purchaseId: string | undefined, date: string | undefined) => {
        if(!purchaseId || !date) return;
      
        try {
          await executeDeletePurchaseFetch(purchaseId); 
          dispatch({
            type: PurchaseActionType.DELETE_PURCHASE,
            payload: purchaseId
          });
        } catch (err) {
          console.error("Error al eliminar compra:", err);
        }
    }

    const handleEdit = (id: string | undefined, date: string | undefined) => {
        modalSetState({
            open: true,
            data: { id, date: date, mode: "edit", form: "purchase" }
        });
    }


  return (
    <>
      <ul className="purchase-list">
        {purchases.map((purchase) => (
          <PurchaseItem key={purchase.purchaseId} purchase={purchase}>
            <div className="purchase-actions">
              <button onClick={() => handleDelete(purchase.purchaseId, date)} className="purchase-button">
                Eliminar
              </button>
              <button onClick={() => purchase.purchaseId && handleEdit(purchase.purchaseId, date)} className="purchase-button">
                Editar
              </button>
            </div>
          </PurchaseItem>
        ))}
      </ul>
    </>
  );
}
import { useCallback, useContext } from "react";
import { Purchase } from "../models/shopListModel";
import { PurchaseContext } from "../context/ShopListContext";
import { useNavigate } from "react-router-dom";
import { purchaseService } from "../services/shopListService";
import { useAxios } from "../../../shared/hooks/useAxios";
import { PurchaseActionType } from "../models/purchaseListState";
import { PurchaseItem } from "./PurchaseItem";

interface Props {
    purchases: Purchase[],
    date: string
};

export const PurchaseList = ({ purchases, date }: Props) => {
    const { dispatch } = useContext(PurchaseContext);
    const navigate = useNavigate();

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

    const handleEdit = (id: string | undefined, date: string | Date) => {
        if (!id || !date) return;
        navigate(`/edit-purchase/${date}/${id}`);
    };

  return (
    <>
      <ul>
        {purchases.map((purchase) => (
          <PurchaseItem key={purchase.purchaseId} purchase={purchase}>
            <button onClick={() => handleDelete(purchase.purchaseId, date)}>
              Eliminar
            </button>
            <button onClick={() => handleEdit(purchase.purchaseId, date)}>
              Editar
            </button>
          </PurchaseItem>
        ))}
      </ul>
    </>
  );
}
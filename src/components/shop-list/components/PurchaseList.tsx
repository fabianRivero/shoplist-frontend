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
};

export const PurchaseList = ({ purchases }: Props) => {
    const { dispatch } = useContext(PurchaseContext);
    const navigate = useNavigate();

    const deletePurchaseServiceCall = useCallback((id: string) => purchaseService.deletePurchase(id), [])
    
    const { error: deleteError, executeFetch: executeDeletePurchaseFetch } = useAxios<string, void>({
        serviceCall: deletePurchaseServiceCall
    });

    const handleDelete = async (id: string) => {
        executeDeletePurchaseFetch(id)
        if(!deleteError){
            dispatch({
                type: PurchaseActionType.DELETE_PURCHASE,
                payload: id
            })
        }
    }

    const handleEdit = (id: string) => {
        navigate(`/purchase/${id}`)
    }

    return(
        <ul>{
            purchases.map((purchase) => (
                <PurchaseItem key={purchase.purchaseId} purchase={purchase}>
                    <button onClick={() => handleDelete(purchase.purchaseId)}>Eliminar</button>
                    <button onClick={() => handleEdit(purchase.purchaseId)}>Editar</button>
                </PurchaseItem>
            ))    
        }</ul>
    )
}
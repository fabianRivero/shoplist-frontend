import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useContext, useEffect, useState } from "react";
import { pendingItem, PendingItemActionType } from "../models";
import { pendingItemsService } from "../services/pendingItemService";
import { ModalContext } from "../../../shared/components/modal/context";
import { FormInput } from "../../../shared/components";
import { AuthContext } from "../../../auth/context";
import { useAxios } from "../../../shared/hooks/useAxios";
import "./styles/shop-item-form.scss";
import z from "zod";
import { capitalize, TokenStorage } from "../../../shared/services";
import { purchaseService } from "../../shop-list/services/shopListService";
import { PurchaseActionType } from "../../shop-list/models/purchaseListState";
import { PurchaseContext } from "../../shop-list/context/ShopListContext";
import { PendingItemContext } from "../context/pendingItem";


const pendingItemSchema = z.object(
    {
        date: z.string(),
        productId: z.string(),
        name: z.string().min(1, "El nombre es requerido"),
        quantity: z.number().min(1, "La cantidad es requerida"),
        purchaseQuantity: z.number().min(1, "La cantidad de compra es requerida"),
        unit: z.string().min(1, "La unidad es requerida"),
        price: z.number().min(0.01, "el precio es requerido"),
        brand: z.string(),
        sector: z.string(),    
    })

    type CreatePurchaseData = z.infer<typeof pendingItemSchema>;

export const PendingItemForm = () => {
    const { register, handleSubmit, formState, reset, watch } = useForm<CreatePurchaseData>({
        resolver: zodResolver(pendingItemSchema)
    })

    const [loading, setLoading] = useState(false)
    const { dispatch } = useContext(PurchaseContext)
    const { state: pendingItemState, dispatch: pendingDispatch } = useContext(PendingItemContext)
    const { state: modalState, setState: modalSetState } = useContext(ModalContext)
    const userState = useContext(AuthContext) 
    const getItemServiceCall = useCallback((id: string) => pendingItemsService.getItem(id), [])
    const [selectedItem, setSelectedItem] = useState<pendingItem | null>(null);

    const { isLoading, error: getItemError } = useAxios<string, pendingItem>({
        serviceCall: getItemServiceCall,
    })
        
    const id = modalState.data?.id;
    const date = String(new Date());
    const usertoken = TokenStorage.getToken();  
    const userInfo = usertoken ? TokenStorage.decodeToken(usertoken) : undefined;

    const purchaseQuantity = watch("purchaseQuantity") || 0;

    const editedPrice = watch("price") || 0;

    const totalCost = purchaseQuantity/(selectedItem?.quantity  ?? 0) * (editedPrice || selectedItem?.price || 0)

    const showBrand = (brand?: string) => {
        return brand && brand.trim().toLowerCase() !== "sin especificar";
    };

    const onSubmit = async (data: CreatePurchaseData) => {
        try{
            setLoading(true)
            const userId = userState.state.user?.id
            if(!userId) throw new Error("Usuario no encontrado");
            if (!date) throw new Error("Fecha no definida");

            const confirmation = confirm("Si confirmas la compra se borrará el producto de la lista de pendientes.")

            if(confirmation){
                const fullData = {
                    ...data,
                    userId: userId,
                    date,
                };

                const createdPurchase = {
                    date: fullData.date,
                    userId: fullData.userId,
                    purchases: [
                        {
                            productId: fullData.productId,
                            name: fullData.name,
                            quantity: fullData.quantity,
                            purchaseQuantity: fullData.purchaseQuantity,
                            unit: fullData.unit,
                            price: fullData.price,
                            brand: fullData.brand,
                            sector: fullData.sector,
                        }
                    ]
                }

                const result = await purchaseService.createPurchase(createdPurchase);
                dispatch({ type: PurchaseActionType.CREATE_PURCHASE, payload: result });
                setLoading(false)
                modalSetState({ open: false, data: modalState.data })

                pendingItemsService.deleteItem(data.productId);

                pendingDispatch({ type: PendingItemActionType.DELETE_ITEM, payload: fullData.productId })
                alert("Compra registrada correctamente. El producto se eliminó de la lista de pendientes.")

            } else{
                setLoading(false)
            }

        } catch(error){
            if(error instanceof Error) alert(error.message || "Error en la operación")
            setLoading(false)
        }finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id && date) {
            const foundItem = pendingItemState.pendingItems.get(id);
            
        if (foundItem) {
            setSelectedItem(foundItem);
            reset({
            date: date ?? "",
            productId: id ?? "",
            name: foundItem.name ?? "",
            quantity: foundItem.quantity ?? 0,
            purchaseQuantity: 0,
            unit: foundItem.unit ?? "",
            price: foundItem.price ?? 0,
            brand: foundItem.brand ?? "",
            sector: foundItem.sector ?? ""
            });
        }
        }
    }, [id, reset, pendingItemState.pendingItems, getItemServiceCall, dispatch, getItemError])

    if(isLoading) return <p>Cargando productos...</p>
    if(getItemError) return <p>Error: {getItemError}</p>

    return(
        <div className={`shop-item-form form-modal`}>
            <h2>Agregar producto</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
            {selectedItem && (
                <>
                    <h3>
                    {capitalize(selectedItem.name)}{" "}
                    {showBrand(selectedItem.brand) && <span>({selectedItem.brand})</span>}
                    </h3>
                    <div className="purchase-quantity">
                    <FormInput
                        label="Cantidad comprada:"
                        register={register("purchaseQuantity", { valueAsNumber: true })}
                        type="number"
                        error={formState.errors.purchaseQuantity?.message}
                    />
                    <p>{selectedItem.unit}</p>
                    </div>
                
                    <div className="stats">
                        <div> 
                            <FormInput
                            label={`Precio por ${selectedItem.quantity} ${selectedItem.unit}:`}
                            register={register("price", { valueAsNumber: true })}
                            type="number"
                            error={formState.errors.price?.message}
                            /> {userInfo?.currency}
                        </div>
        
                    <p>
                        Cantidad comprada: <strong>{purchaseQuantity}</strong> {selectedItem.unit}
                    </p>
                    <p>
                        Costo total: <strong>
                            {totalCost.toFixed(2)}
                            </strong> {userInfo?.currency}
                        </p>
                        {selectedItem.sector && (
                        <p>Sector: {selectedItem.sector}</p>
                        )}
                    </div> 
                </>
            )}

                <button type="submit" disabled={loading}>
                    {loading ? "Agregando" : "Agragar"}
                </button>
            </form>
        </div>
    )
}







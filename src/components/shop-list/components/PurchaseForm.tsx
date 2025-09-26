import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState } from "react";
import { PurchaseContext } from "../context/ShopListContext";
import { ModalContext } from "../../../shared/components/modal/context";
import { purchaseService } from "../services/shopListService";
import { PurchaseActionType } from "../models/purchaseListState";
import { FormInput } from "../../../shared/components";
import { ShopItemContext } from "../../shop-items/context/shopItem";
import { shopItem } from "../../shop-items/models";
import { Purchase } from "../models/shopListModel";
import { AuthContext } from "../../../auth/context";
import "./styles/purchase-form.scss";

const createPurchaseSchema = z.object({
  date: z.string(),
  productId: z.string(),
  name: z.string().min(1, "El nombre es requerido"),
  quantity: z.number().min(1, "La cantidad es requerida"),
  purchaseQuantity: z.number().min(1, "La cantidad de compra es requerida"),
  unit: z.string().min(1, "La unidad es requerida"),
  price: z.number().min(0.01, "el precio es requerido"),
  currency: z.string().min(1, "La moneda es requerida"),
  brand: z.string().optional(),
  sector: z.string().optional(),
});

const updatePurchaseSchema = createPurchaseSchema.extend({
  purchaseId: z.string().min(1),
});

type CreatePurchaseData = z.infer<typeof createPurchaseSchema>;
type UpdatePurchaseData = z.infer<typeof updatePurchaseSchema>;

type Props = {
  mode: "create" | "edit";
};

export const PurchaseForm = ({ mode }: Props) => {
  const schema = mode === "create" ? createPurchaseSchema : updatePurchaseSchema;
  const itemState  = useContext(ShopItemContext)
  const { state, dispatch } = useContext(PurchaseContext)
  const { state: modalState, setState: modalSetState } = useContext(ModalContext);
  const [selectedItem, setSelectedItem] = useState<shopItem | Purchase | null>(null);
  const userState = useContext(AuthContext)

  const id = modalState.data?.id;
  const date = modalState.data?.date;

  const { register, handleSubmit, formState, reset, watch } = useForm<
  CreatePurchaseData | UpdatePurchaseData
  >({
    resolver: zodResolver(schema),
  })
  
  const purchaseQuantity = watch("purchaseQuantity") || 0;

  const editedPrice = watch("price") || 0;

  const totalCost = mode === "create" ?
  purchaseQuantity * (selectedItem?.price ?? 0)
  : purchaseQuantity * (editedPrice || selectedItem?.price || 0);

  const showBrand = (brand?: string) => {
    return brand && brand.trim().toLowerCase() !== "sin especificar";
  };

  const onSubmit = async (data: CreatePurchaseData | UpdatePurchaseData) => {

    try{
      const userId = userState.state.user?.id
      if(!userId) throw new Error("Usuario no encontrado");
      if (!date) throw new Error("Fecha no definida");

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
            currency: fullData.currency,
            brand: fullData.brand,
            sector: fullData.sector,
          }
        ]
      }

      const editedPurchase = {
        ...createdPurchase,
        purchases: [
          {
            ...createdPurchase.purchases[0], 
            purchaseId: id                   
          }
        ]
      };

      let result = null;

      if (mode === "edit") {
        if (!editedPurchase.date) throw new Error("Compra no registrada");

        // actualizar compra
        const response = await purchaseService.updatePurchase(editedPurchase);
        dispatch({ type: PurchaseActionType.UPDATE_PURCHASE, payload: response });

      } else {
        // crear compra
        result = await purchaseService.createPurchase(createdPurchase);
        dispatch({ type: PurchaseActionType.CREATE_PURCHASE, payload: result });
      }

      modalSetState({ open: false, data: modalState.data });
    } catch (error){
      if(error instanceof Error) alert(error.message || "Error en la operación")
    }
  }

  useEffect(() => {
  if (id && mode === "create") {
    const foundItem = itemState.state.items.get(id);
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
          currency: foundItem.currency ?? "",
          brand: foundItem.brand ?? "",
          sector: foundItem.sector ?? ""
        });
      }
  } else if (id && mode === "edit" && date) {
    (async () => {
      const response = await purchaseService.getPurchasesByCharacteristic("day", date);

    const allPurchases = response.register.logs.flatMap(r => r.purchases ?? []);
    const foundPurchase = allPurchases.find(p => p.purchaseId === id);

    if (!foundPurchase) {
      console.error("Compra no encontrada");
      return;
    }
    setSelectedItem(foundPurchase);
    
    reset({
      date,
      purchaseId: foundPurchase.purchaseId,
      productId: foundPurchase.productId,
      name: foundPurchase.name ?? "",
      quantity: foundPurchase.quantity ?? 0,
      purchaseQuantity: foundPurchase.purchaseQuantity ?? 0,
      unit: foundPurchase.unit ?? "",
      price: foundPurchase.price ?? 0,
      currency: foundPurchase.currency ?? "",
      brand: foundPurchase.brand ?? "",
      sector: foundPurchase.sector ?? ""
    });

    })();
    }
  }, [id, date, reset, state, itemState.state.items, mode]);

  return(
    <div className="purchase-form-container">
      <h2>{mode === "edit" ? "Actualizar compra" : "Añadir compra"}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {selectedItem && (
        <>
          <h3>
          {selectedItem.name}{" "}
      {showBrand(selectedItem.brand) && <span>({selectedItem.brand})</span>}
    </h3>
      <div>
        <FormInput
          label="Cantidad comprada:"
          register={register("purchaseQuantity", { valueAsNumber: true })}
          type="number"
          error={formState.errors.purchaseQuantity?.message}
        />
        <p>{selectedItem.unit}</p>
      </div>
      
      <div>
        {mode === "create" ? (
          <p>
            Precio por {selectedItem.unit}: 
            <strong>{selectedItem.price.toFixed(2)}</strong> {selectedItem.currency}
          </p>
          ) : (
          <div> 
            <FormInput
              label={`Precio por ${selectedItem.unit}:`}
              register={register("price", { valueAsNumber: true })}
              type="number"
              error={formState.errors.price?.message}
            /> {selectedItem.currency}
          </div>
        )}

        <p>
          Cantidad comprada: <strong>{purchaseQuantity}</strong> {selectedItem.unit}
        </p>
         <p>
            Costo total: <strong>{totalCost.toFixed(2)}</strong> {selectedItem.currency}
          </p>
          {selectedItem.sector && (
            <p>Sector: {selectedItem.sector}</p>
          )}
      </div> 
    </>
    )}

    <button type="submit">{mode === "edit" ? "Actualizar compra" : "Añadir compra"}</button>
  </form>
</div>
  )
}



import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { ShopItemContext } from "../context/shopItem";
import { ShopItemActionType } from "../models";
import { shopItemsService } from "../services/shopItemService";
import { TokenStorage } from "../../../shared/services";
import { ModalContext } from "../../../shared/components/modal/context";
import { FormInput } from "../../../shared/components";

const getUserId = () => {
    const token = TokenStorage.getToken()
    if(!token){
        console.error("Token no encontrado");
        return null;
    } else{
        const user = TokenStorage.decodeToken(token);
        return user;
    }
} 

const shopItemSchema = z.object(
    {
        userId: z.string(),
        name: z.string().min(1, "El nombre es requerido"),
        quantity: z.number().min(1, "La cantidad es requerida"),
        unit: z.string().min(1, "La unidad es requerida"),
        price: z.number().min(1, "el precio es requerido"),
        currency: z.string().min(1, "La moneda es requerida"),
        brand: z.string().optional(),
        sector: z.string().min(1, "Sector es necesario"),        
    })

type ShopItemData = z.infer<typeof shopItemSchema>
type ShopItemFormData = Omit<ShopItemData, "userId">

export const ShopItemForm = () => {
    const { register, handleSubmit, formState, reset } = useForm<ShopItemFormData>({
        resolver: zodResolver(shopItemSchema.omit({ userId: true }))
    })
    const { id } = useParams()
    const { state, dispatch } = useContext(ShopItemContext)
    const { setState: modalSetState } = useContext(ModalContext)
    const navigate = useNavigate()    

    useEffect(() => {
        if(id){
            const foundItem = state.items.get(id)
            reset(foundItem)
        }
    }, [id, reset, state.items])

    const onSubmit = async (data: ShopItemFormData) => {
        try{
            const user = getUserId();
            if(!user?.id) throw new Error("Usuario no encontrado");

            
            const fullData: ShopItemData = {
                ...data,
                userId: user.id,
            };

            let result = null;
            
            if(id){
                result = await shopItemsService.updateItem({ ...fullData, id });
                dispatch({ type: ShopItemActionType.UPDATE_ITEM, payload: result });
            } else{
                result = await shopItemsService.createItem(fullData);
                console.log("Resultado de crear:", result); 
                dispatch({ type: ShopItemActionType.CREATE, payload: result });
            }


             modalSetState(false)
            navigate("/item-list")
        } catch(error){
            if(error instanceof Error) alert(error.message || "Error en la operación")
        }
    }

    return(
        <div className="container">
            <h2>{id ? "Editar" : "Crear"} Producto</h2>

<form onSubmit={handleSubmit(onSubmit, (errors) => {
  console.log("Errores en validación", errors);
})}>
                <FormInput label="Nombre" register={register("name")} error={formState.errors.name?.message} />
                <FormInput label="Cantidad" register={register("quantity", { valueAsNumber: true })} type="number" error={formState.errors.quantity?.message} />
                <FormInput label="Unidad" register={register("unit")} error={formState.errors.unit?.message} />
                <FormInput label="Precio" register={register("price", { valueAsNumber: true })} type="number" error={formState.errors.price?.message} />
                <FormInput label="Moneda" register={register("currency")} error={formState.errors.currency?.message} />
                <FormInput label="Marca" register={register("brand")} error={formState.errors.brand?.message} />
                <FormInput label="Sector" register={register("sector")} error={formState.errors.sector?.message} />

                <button type="submit">{id ? "Editar" : "Crear"}</button>
            </form>
        </div>
    )
}







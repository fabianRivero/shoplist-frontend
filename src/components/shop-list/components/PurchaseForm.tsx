import z from "zod";
import { TokenStorage } from "../../../shared/services"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const getUserId = () => {
    const token = TokenStorage.getToken()
    if(!token){
        console.error("Token no encontrado")
        return null;
    } else{
        const user = TokenStorage.decodeToken(token)
        return user;
    }
}

const purchaseSchema = z.object({
  productId: z.string(),
  name: z.string().min(1, "El nombre es requerido"),
  quantity: z.number().min(1, "La cantidad es requerida"),
  purchaseQuantity: z.number().min(1, "La cantidad de compra es requerida"),
  unit: z.string().min(1, "La unidad es requerida"),
  price: z.number().min(1, "El precio es requerido"),
  currency: z.string().min(1, "La moneda es requerida"),
  brand: z.string().optional().default("Sin especificar"),
  sector: z.string().default("other"),
  purchaseId: z.string()
});

type PurchaseData = z.infer<typeof purchaseSchema>


const purchaseLogSchema = z.object({
  userId: z.string().min(1, "El usuario es requerido"),
  date: z.coerce.date(), // o z.string()
  purchases: z.array(purchaseSchema).min(1, "Debe haber al menos una compra"),
});

type PurchaseLogData = z.infer<typeof purchaseLogSchema>
type PurchaseLogFormData = Omit<PurchaseLogData, "userId">

export const PurchaseForm = () => {
  const { register, handleSubmit, formState, reset } = useForm<PurchaseLogFormData>({
    resolver: zodResolver(purchaseLogSchema.omit({ userId: true }))
  })

  
}



import z from "zod"
import { FormInput } from "../../../../../shared/components"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useContext } from "react"
import { SummaryContext } from "../../../context/summaryContext"
import { ModalContext } from "../../../../../shared/components/modal/context"
import { SummaryActionType } from "../../../models/summaryState"
import { summaryService } from "../../../services/summaryService"

type Props = {
  year: number;
  month: number;
  sector?: string; 
  defaultValue?: number;
}

const budgetPlanningFormSchema = z.object(
    {
        quantity: z.number().min(0.01, "La cantidad es requerida"),
    })

    type budgetPlanningData = z.infer<typeof budgetPlanningFormSchema>

    export const BudgetPlanningForm = ({ year, month, sector, defaultValue }: Props) => {
        const { register, handleSubmit, formState } = useForm<budgetPlanningData>({
            resolver: zodResolver(budgetPlanningFormSchema),
            defaultValues: { quantity: defaultValue ?? 0 }  
        })
        const { dispatch } = useContext(SummaryContext)
        const { setState: modalSetState } = useContext(ModalContext)

        const onSubmit = async (data: budgetPlanningData) => {
            try{
                let result;

                if(sector){
                    result = await summaryService.setSectorBudget(year, month, sector, data.quantity);
                    dispatch({ type: SummaryActionType.SET_SECTOR_BUDGET, payload: result });
                } else {
                    result = await summaryService.setGeneralBudget(year, month, data.quantity);
                    
                    dispatch({ type: SummaryActionType.SET_GENERAL_BUDGET, payload: result });
                }

                modalSetState(false)

            } catch(error){
                if(error instanceof Error) alert(error.message || "Error en la operación")
            }
        }

        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormInput 
                label="Cantidad"
                type="number"
                register={register("quantity", { valueAsNumber: true })} 
                error={formState.errors.quantity?.message} />
                <button type="submit">Guardar</button>
            </form>
        )
}
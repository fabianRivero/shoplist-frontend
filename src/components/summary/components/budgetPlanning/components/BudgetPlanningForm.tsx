import z from "zod";
import { FormInput } from "../../../../../shared/components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { SummaryContext } from "../../../context/summaryContext";
import { ModalContext } from "../../../../../shared/components/modal/context";
import { SummaryActionType } from "../../../models/summaryState";
import { summaryService } from "../../../services/summaryService";
import "./styles/budget-palnning-form.scss";
import { capitalize } from "../../../../../shared/services";
import { FormSelect } from "../../../../../shared/components/FormSelect";

type Props = {
  year: number;
  month?: number;
  sector?: string; 
  defaultValue?: number;
  isNewSector?: boolean;   
  isNewMonth?: boolean; 
}

const budgetPlanningFormSchema = z.object(
    {
        quantity: z.number().min(0.01, "La cantidad debe ser positiva"),
        sector: z.string().min(1, "El sector es requerido").optional(),
        month: z.number().min(1).max(12, "Mes inválido").optional(),
    })

    type budgetPlanningData = z.infer<typeof budgetPlanningFormSchema>

    export const BudgetPlanningForm = ({ year, month, sector, defaultValue, isNewSector, isNewMonth }: Props) => {
        const { register, handleSubmit, formState } = useForm<budgetPlanningData>({
            resolver: zodResolver(budgetPlanningFormSchema),
            defaultValues: { quantity: defaultValue ?? 0 }  
        })
        const { dispatch } = useContext(SummaryContext)
        const { setState: modalSetState } = useContext(ModalContext)

        const selectOptions = [
            { value: 1, label: "Enero" },
            { value: 2, label: "Febrero" },
            { value: 3, label: "Marzo" },
            { value: 4, label: "Abril" },
            { value: 5, label: "Mayo" },
            { value: 6, label: "Junio" },
            { value: 7, label: "Julio" },
            { value: 8, label: "Agosto" },
            { value: 9, label: "Septiembre" },
            { value: 10, label: "Octubre" },
            { value: 11, label: "Noviembre" },
            { value: 12, label: "Diciembre" },
        ]

        const onSubmit = async (data: budgetPlanningData) => {
        try {
            let result;

            if (isNewMonth) {
            if (!data.month || !data.sector) throw new Error("Mes y sector son requeridos");
            result = await summaryService.setSectorBudget(year, data.month, data.sector, data.quantity);
            dispatch({ type: SummaryActionType.SET_SECTOR_BUDGET, payload: result });
            } 
            else if (isNewSector) {
            if (!data.sector) throw new Error("El sector es requerido");
            result = await summaryService.setSectorBudget(year, month!, data.sector, data.quantity);
            dispatch({ type: SummaryActionType.SET_SECTOR_BUDGET, payload: result });
            } 
            else if (sector) {
            result = await summaryService.setSectorBudget(year, month!, sector, data.quantity);
            dispatch({ type: SummaryActionType.SET_SECTOR_BUDGET, payload: result });
            } 
            else {
            result = await summaryService.setGeneralBudget(year, month!, data.quantity);
            dispatch({ type: SummaryActionType.SET_GENERAL_BUDGET, payload: result });
            }

            modalSetState(false);
        } catch (error) {
            if (error instanceof Error) alert(error.message || "Error en la operación");
        }
        };


        return (
            <form onSubmit={handleSubmit(onSubmit)} className="budget-planning-form">
                
                <h3>Establecer presupuesto</h3>

                {isNewMonth && (
                <FormSelect<budgetPlanningData>
                label="Mes"
                name="month"
                register={register}
                error={formState.errors.month?.message}
                options={selectOptions}
                setValueAs={(v) => Number(v)}
                />
                )}

                {(isNewSector || isNewMonth) && (
                <FormInput
                label="Sector"
                type="text"
                register={{
                    ...register("sector", {
                    setValueAs: (v) =>
                        v ? capitalize(v) : v,
                    }),
                }}
                error={formState.errors.sector?.message}
                />
                )}

                <div>
                    <FormInput
                    label="Cantidad"
                    type="number"
                    register={register("quantity", { valueAsNumber: true })}
                    error={formState.errors.quantity?.message}
                    />
                    <span>USD</span>
                </div>
                 
                <button type="submit">Guardar</button>
            </form>
        )
}
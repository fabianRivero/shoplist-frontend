import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { AnalyzerContext } from "../context/analyzerContext";
import { ModalContext } from "../../../shared/components/modal/context";
import { analyzerService } from "../services/AnalyzerService";
import { AnalyzerActionType } from "../models/AnalizerState";
import Calendar from "react-calendar";
import "./styles/add-item-form.scss"
import { register } from "../models/analyzerModel";

const formSchema = z.object(
    {
        period: z.enum(["month", "year"]),
        month: z.string().optional(),
        year: z.string(),
        sector: z.string()
    }
);

type MonthFormData = z.output<typeof formSchema>;

export const AddItemForm = () => {
    const { control, register, handleSubmit, setValue } = useForm<MonthFormData>({
        resolver: zodResolver(formSchema),
    })

    const { state, dispatch } = useContext(AnalyzerContext)
    const { setState: modalSetState } = useContext(ModalContext)
    const [loading, setLoading] = useState(false)

    const onSubmit: SubmitHandler<MonthFormData> = async (data) => {
        try {
            setLoading(true);
            let result: register;
            if(state.period === "month"){
            result = await analyzerService.getItem(state.period, `${data.year}-${data.month}-01`, data.sector) 
            } else{
                result = await analyzerService.getItem(state.period, `${data.year}-01-01`, data.sector)
            }
            
        const exists = state.items.some(
            (item) => item.register.startDate === result.register.startDate
        );

        if (exists) {
            alert("Ese item ya está agregado");
            setLoading(false)
            return; 
        }

            dispatch({ type: AnalyzerActionType.ADD, payload: result })

            modalSetState({ open: false })
            setLoading(false)
        } catch (error) {
           if(error instanceof Error)
            alert(error.message || "Error en la operación")
           setLoading(false)
        }
    }

    const calendarStructure = state.period === "month" ? "year" : "decade" 

    return (
         <div className="month-form-container">
            <h2>Agregar item</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="month-form">

                <Controller
                    control={control}
                    name= {state.period === "month" ? "month" : "year"}
                    render={({ field }) => (
                        <Calendar
                            onClickMonth={(value) => {
                                if (value instanceof Date) {

                                    const year = value.getFullYear().toString();
                                    const month = (value.getMonth() + 1).toString().padStart(2, "0");

                                    setValue("year", year, { shouldValidate: true });
                                    setValue("month", month, { shouldValidate: true });

                                    field.onChange(month);
                                }
                            }}

                            onClickYear={(value) => {
                                if (value instanceof Date) {

                                const year = value.getFullYear().toString();

                                setValue("year", year, { shouldValidate: true });
                                field.onChange(year);
                                }
                            }}
            
                            view={calendarStructure}
                        />
                    )}
                />

                <input type="hidden" value={state.period} {...register("period")} />
                <input type="hidden" value="" {...register("sector")} />

                <button type="submit" className="button" disabled={loading}>
                    {loading === true ? `Agregando...` : `Agregar`}
                </button>
            </form>
        </div>
    )
}
import { Summary } from "../../models/summaryModel";
import { useCallback, useContext, useEffect, useState } from "react";
import { ModalContext } from "../../../../shared/components/modal/context";
import { useAxios } from "../../../../shared/hooks/useAxios";
import { summaryService } from "../../services/summaryService";
import { SummaryContext } from "../../context/summaryContext";
import { SummaryActionType } from "../../models/summaryState";
import { Modal } from "../../../../shared/components/modal/Modal";
import { BudgetPlanningForm } from "./components/BudgetPlanningForm";
import { GeneralBudgetTable } from "./components/GeneralBudgetTable";
import { SectorBudgetTable } from "./components/SectorBudgetTable";
import "./styles/budget-planning-container.scss";

export function BudgetPlanningContainer() {

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const localDate = `${year}-${month}-${day}`;

    const { setState } = useContext(ModalContext);
    const { state, dispatch } = useContext(SummaryContext);
    const [editingBudget, setEditingBudget] = useState<{
    year: number;
    month?: number;
    sector?: string;   
    defaultValue?: number;
    isNewSector?: boolean;
    isNewMonth?: boolean;
    } | null>(null);

    const getBudgetsServiceCall = useCallback(() => summaryService.getSummary(localDate, "year"), [localDate])
    const { isLoading, data: summary, error } = useAxios<void, Summary>({
        serviceCall: getBudgetsServiceCall,
        trigger: true
    })

    const openModal = (
    year: number,
    month?: number,
    sector?: string,
    defaultValue?: number,
    isNewSector = false,
    isNewMonth = false
    ) => {
    setEditingBudget({ year, month, sector, defaultValue, isNewSector, isNewMonth });
    setState({open: true});
    };

    useEffect(() => {
        if (summary) {
            dispatch({ type: SummaryActionType.GET, payload: summary });
        }
    }, [summary, dispatch]);


    if(isLoading) return <p>Cargando...</p>
    if(error) return <p>Error: {error}</p>
     
    return(
    <div className="budget-summary-container">
        { 
        state.summary ?  (
            <div className="budget-summary">
            <h2>Establecer Presupuestos</h2>

            <h3>Presupuestos para el año {state.summary.baseDate.slice(0, 4)}</h3>

            <div className="tables-container">
            <GeneralBudgetTable
                year={year}
                onOpenModal={openModal}
            />

            <SectorBudgetTable
                year={year}
                onOpenModal={openModal}
            />
            </div>

            <Modal>
            {editingBudget && (
                <BudgetPlanningForm
                year={editingBudget.year}
                month={editingBudget.month}
                sector={editingBudget.sector}
                defaultValue={editingBudget.defaultValue}
                isNewSector={editingBudget.isNewSector}
                isNewMonth={editingBudget.isNewMonth}
                />
            )}
            </Modal>

            </div>
        ) : (
            <p className="error-message">Error al cargar resumen</p>
        )
        }
    </div>
    );
};
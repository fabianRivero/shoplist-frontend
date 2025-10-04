import { Budget, Summary } from "../../models/summaryModel";
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

export function BudgetTableContainer() {

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
        amount?: number;   
    } | null>(null);

    const getBudgetsServiceCall = useCallback(() => summaryService.getSummary(localDate, "year"), [localDate])
    const { isLoading, data: summary, error } = useAxios<void, Summary>({
        serviceCall: getBudgetsServiceCall,
        trigger: true
    })

    const deleteGeneralBudgetServiceCall = useCallback(
        (body: { year: string | number; month: string | number }) => 
        summaryService.deleteGeneralBudget(body.year, body.month), []
    )

    const { data: deleteGeneralResponse, error: deleteGeneralError, executeFetch: executeDeleteGeneralBudgetFetch } = 
    useAxios<{year: string | number, month: string | number}, Budget>({
        serviceCall: deleteGeneralBudgetServiceCall,
    })

    const handleGeneralBudgetDelete = async (year: string | number, month: string | number) => {
        if(!year || !month) return;
        executeDeleteGeneralBudgetFetch({year, month})
    }

    const deleteSectorBudgetServiceCall = useCallback(
        (body: { year: string | number; month: string | number; sector: string }) => 
        summaryService.deleteSectorBudget(body.year, body.month, body.sector), []
    )

    const { data: deleteSectorResponse, error: deleteSectorError, executeFetch: executeDeleteSectorBudgetFetch } = 
        useAxios<{year: string | number, month: string | number, sector: string}, Budget>({
        serviceCall: deleteSectorBudgetServiceCall,
    })

    const handleSectorBudgetDelete = async (year: string | number, month: string | number, sector: string) => {
        if(!year || !month || !sector) return;
        executeDeleteSectorBudgetFetch({year, month, sector})
    }

    const openModal = (year: number, month?: number, sector?: string, amount?: number) => {
        setEditingBudget({ year, month, sector, amount });
        setState({open: true});
    };

    useEffect(() => {
        if(summary) { 
            dispatch({ type: SummaryActionType.GET, payload: summary })
        }

        if (deleteGeneralResponse && !deleteGeneralError) {
            dispatch({
            type: SummaryActionType.DELETE_GENERAL_BUDGET,
            payload: deleteGeneralResponse
            });
        }

        if (deleteSectorResponse && !deleteSectorError) {
            dispatch({
            type: SummaryActionType.DELETE_SECTOR_BUDGET,
            payload: deleteSectorResponse
            });
        }

    }, [dispatch, summary, deleteGeneralResponse, deleteGeneralError, deleteSectorResponse, deleteSectorError])

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
                budgets={state.summary?.budgets}
                onOpenModal={openModal}
                onDelete={handleGeneralBudgetDelete}
            />

            <SectorBudgetTable
                year={year}
                budgets={state.summary?.budgets}
                onOpenModal={openModal}
                onDelete={handleSectorBudgetDelete}
            />
            </div>

            <Modal>
                {editingBudget && (
                    <BudgetPlanningForm
                    year={editingBudget.year}
                    month={editingBudget.month}
                    sector={editingBudget.sector}
                    defaultValue={editingBudget.amount}
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
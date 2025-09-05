import { useCallback, useContext, useEffect, useState } from "react";
import { summaryService } from "../../services/summaryService";
import { useAxios } from "../../../../shared/hooks/useAxios";
import { Budget, Summary } from "../../models/summaryModel";
import { SummaryContext } from "../../context/summaryContext";
import { Modal } from "../../../../shared/components/modal/Modal";
import { ModalContext } from "../../../../shared/components/modal/context";
import { BudgetPlanningForm } from "./components/BudgetPlanningForm";
import { SummaryActionType } from "../../models/summaryState";
import { budgetService } from "./services/budgetService";

export const BudgetPlanningContainer = () => {

    const { state, dispatch } = useContext(SummaryContext);
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const localDate = `${year}-${month}-${day}`;
    const { setState } = useContext(ModalContext)
    const [editingBudget, setEditingBudget] = useState<{
        year: number;
        month: number;
        sector?: string;   
        amount?: number;   
    } | null>(null);

    const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);

    const getBudgetsServiceCall = useCallback(() => summaryService.getSummary(localDate, "year"), [localDate])
    const { isLoading, data: summary, error } = useAxios<void, Summary>({
        serviceCall: getBudgetsServiceCall,
        trigger: true
    })

    const deleteGeneralBudgetServiceCall = useCallback(
        (body: { year: string | number; month: string | number }) => 
        budgetService.deleteGeneralBudget(body.year, body.month), [])

    const { data: deleteGeneralResponse, error: deleteGeneralError, executeFetch: executeDeleteGeneralBudgetFetch } = 
    useAxios<{year: string | number, month: string | number}, Budget>({
        serviceCall: deleteGeneralBudgetServiceCall,
    })

    const deleteSectorBudgetServiceCall = useCallback(
        (body: { year: string | number; month: string | number; sector: string }) => 
        budgetService.deleteSectorBudget(body.year, body.month, body.sector), [])

    const { data: deleteSectorResponse, error: deleteSectorError, executeFetch: executeDeleteSectorBudgetFetch } = 
    useAxios<{year: string | number, month: string | number, sector: string}, Budget>({
        serviceCall: deleteSectorBudgetServiceCall,
    })

    const handleGeneralBudgetDelete = async (year: string | number, month: string | number) => {
        if(!year || !month) return;
        executeDeleteGeneralBudgetFetch({year, month})
    }

    const handleSectorBudgetDelete = async (year: string | number, month: string | number, sector: string) => {
    if(!year || !month || !sector) return;
        executeDeleteSectorBudgetFetch({year, month, sector})
    }

    function findBudget(month: number) {
        return state.summary?.budgets?.find((b) => b.month === month);
    }

    const openModal = (year: number, month: number, sector?: string, amount?: number) => {
        setEditingBudget({ year, month, sector, amount });
        setState(true);
    };

    function getMonth(num: number, locale = "es-ES") {
        const fecha = new Date(2000, num - 1, 1); 
        return new Intl.DateTimeFormat(locale, { month: "long" }).format(fecha);
    }

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

  return (
    <>
        { 
        state.summary ?  (
            <>
                <h2>Establecer Presupuesto</h2>

                <div>Presupuestos para el año {state.summary.baseDate.slice(0, 4)}</div>

                <div>
                    <h3>Presupuesto general</h3>

                    <table border ="1">
                        <thead>
                            <tr>
                                <th>Mes</th>
                                <th>Presupuesto</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.summary.budgets ? (
                            allMonths.map((monthNum) => {
                                const budget = findBudget(monthNum);
                                const withBudget = budget?.general && budget.general > 0;
                                return (
                                <tr key={monthNum}>
                                    <td>{getMonth(monthNum)}</td>
                                    <td>
                                    {withBudget ? `${budget.general} USD` : "No establecido"}
                                    </td>
                                    <td>
                                    {!withBudget ? (
                                    <button onClick={() => openModal(year, monthNum, undefined, budget?.general)}>
                                        Agregar presupuesto
                                    </button>
                                    ) : (
                                        <>
                                        <button onClick={() => openModal(year, monthNum, undefined, budget?.general)}>
                                            Editar presupuesto
                                        </button>
                                        <button onClick={() => {
                                            handleGeneralBudgetDelete(year, monthNum)
                                            }}>
                                            Borrar presupuesto
                                        </button>
                                        </>
                                    )}
                                    </td>
                                </tr>
                                );
                            })
                            ) : (
                            <tr>
                                <td colSpan={3}>No hay sectores disponibles</td>
                            </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div>
                    <h3>Presupuesto por sector</h3>

                    <table border ="1">
                        <thead>
                            <tr>
                                <th>Mes</th>
                                <th>Sector</th>
                                <th>Presupuesto</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.summary.budgets ? (
                            state.summary.budgets.map((budget) => {
                                const sectorCount = budget.sectors.length;
                                return budget.sectors.map((sector, index) => {
                                const withBudget = sector.budget && sector.budget > 0;
                                return (
                                    <tr key={`${budget.month}-sector-${sector.sector}`}>
                                    {index === 0 && (
                                        <td rowSpan={sectorCount}>{getMonth(budget.month)}</td>
                                    )}
                                    <td>{sector.sector}</td>
                                    <td>
                                        {withBudget ? `${sector.budget} USD` : "No establecido"}
                                    </td>
                                    <td>
                                    {!withBudget ? (
                                    <button
                                    onClick={() =>
                                        openModal(budget.year, budget.month, sector.sector, sector.budget)
                                    }
                                    >
                                    Agregar presupuesto
                                    </button>
                                        ) : (
                                        <>
                                            <button
                                            onClick={() => {
                                                const filterSector = budget.sectors.filter((sec) => sec.sector === sector.sector)
                                                const filteredSector = filterSector[0].sector
                                                const filteredBudget = filterSector[0].budget ? filterSector[0].budget : 0 
                                                openModal(year, budget.month, filteredSector, filteredBudget)
                                            }}
                                            >
                                            Editar presupuesto
                                            </button>
                                            <button
                                            onClick={() => {
                                                const filterSector = budget.sectors.filter((sec) => sec.sector === sector.sector)
                                                console.log(filterSector)
                                                const filteredSector = filterSector[0].sector
                                                handleSectorBudgetDelete(year, budget.month, filteredSector)
                                            }}>
                                            Borrar presupuesto
                                            </button>
                                        </>
                                        )}
                                    </td>
                                    </tr>
                                );
                                });
                            })
                            ) : (
                            <tr>
                                <td colSpan={4}>No hay sectores disponibles</td>
                            </tr>
                            )}
                        </tbody>
                    </table>
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
        </>
        ) : (
            <p>Error al cargar resumen</p>
        )
        }
    </>
  );
};

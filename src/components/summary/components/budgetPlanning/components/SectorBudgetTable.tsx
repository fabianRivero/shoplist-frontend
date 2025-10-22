import React, { useCallback, useContext, useEffect } from "react";
import { capitalize, getMonthName, TokenStorage } from "../../../../../shared/services";
import { Budget } from "../../../models/summaryModel";
import "./styles/table.scss";
import { summaryService } from "../../../services/summaryService";
import { useAxios } from "../../../../../shared/hooks/useAxios";
import { SummaryActionType } from "../../../models/summaryState";
import { SummaryContext } from "../../../context/summaryContext";

interface SectorBudgetTableProps {
  year: number;
  onOpenModal: (
    year: number,
    month?: number,
    sector?: string,
    defaultValue?: number,
    isNewSector?: boolean,
    isNewMonth?: boolean
  ) => void;
}

export const SectorBudgetTable = ({ year, onOpenModal }: SectorBudgetTableProps) => {

    const { state: summaryState, dispatch } = useContext(SummaryContext);

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
  const usertoken = TokenStorage.getToken();  
  const userInfo = usertoken ? TokenStorage.decodeToken(usertoken) : undefined;

  useEffect(() => {
      if (deleteSectorResponse && !deleteSectorError) {
          dispatch({
          type: SummaryActionType.DELETE_SECTOR_BUDGET,
          payload: deleteSectorResponse
          });

      }
  }, [dispatch, deleteSectorResponse, deleteSectorError])
  
  return (
    <div className="sector table">
        
        <div className="table-title">
          <h4>Presupuesto por sector</h4>
          <button
            onClick={() =>
              onOpenModal(year, undefined, undefined, undefined, false, true)
            }
          >
            Crear nuevo presupuesto
          </button>
        </div>

      <table>

        <thead>
          <tr>
            <th>Mes</th>
            <th>Sector</th>
            <th>Presupuesto</th>
            <th>Acciones</th>
          </tr>
        </thead>
    
    <tbody>

      {summaryState.summary?.budgets?.map((budget) => {
      const sectorCount = budget.sectors.length;

      return (
      <React.Fragment key={`budget-${budget.month}`}>
        {budget.sectors.map((sector, index) => {

          const withBudget = sector.budget && sector.budget > 0;
          return (
            <tr key={`${budget.month}-sector-${sector.sector}`}>
              {index === 0 && (
                <td rowSpan={sectorCount + 1} className="month-cell">
                  {getMonthName({ num: budget.month })}
                </td>
              )}
            <td>{capitalize(sector.sector)}</td>
            <td className={withBudget ? "" : "not-found-message"}>
              {withBudget ? `${sector.budget} ${userInfo?.currency}` : "No establecido"}
            </td>
            <td>
              {!withBudget ? (
                <button
                  onClick={() =>
                    onOpenModal(budget.year, budget.month, sector.sector, sector.budget, false, false)
                  }
                >
                  Agregar presupuesto
                </button>
              ) : (
                  <>
                    <button
                      onClick={() =>
                        onOpenModal(budget.year, budget.month, sector.sector, sector.budget || 0, false, false)
                      }
                    >
                      Editar presupuesto
                    </button>
                    <button onClick={() => handleSectorBudgetDelete(budget.year, budget.month, sector.sector)}>
                      Borrar presupuesto
                    </button>
                  </>
                  )}
                </td>
              </tr>
            );
          })}

            {budget.sectors.length > 0 &&
              <tr>
                <td></td>
                <td></td>
                <td colSpan={3} className="add-sector-cell">
                  <button
                  onClick={() =>
                    onOpenModal(budget.year, budget.month, undefined, 0, true, false)
                  }
                >
                  Nuevo presupuesto
                </button>
                </td>
              </tr>
            }
            
        </ React.Fragment>
        );
      })}
    </tbody>

      </table>
    </div>
  );
};

import { useCallback, useContext, useEffect } from "react";
import { getMonthName, TokenStorage } from "../../../../../shared/services";
import { Budget } from "../../../models/summaryModel";
import "./styles/table.scss";
import { SummaryContext } from "../../../context/summaryContext";
import { summaryService } from "../../../services/summaryService";
import { useAxios } from "../../../../../shared/hooks/useAxios";
import { SummaryActionType } from "../../../models/summaryState";

interface GeneralBudgetTableProps {
  year: number;
  onOpenModal: (year: number, month: number, sector?: string, amount?: number) => void;
}

export const GeneralBudgetTable = ({ year, onOpenModal }: GeneralBudgetTableProps) => {
 
  const { state: summaryState, dispatch } = useContext(SummaryContext);

  const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);

  const usertoken = TokenStorage.getToken();  
  const userInfo = usertoken ? TokenStorage.decodeToken(usertoken) : undefined;
  
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

  useEffect(() => {
      if (deleteGeneralResponse && !deleteGeneralError) {
          dispatch({
          type: SummaryActionType.DELETE_GENERAL_BUDGET,
          payload: deleteGeneralResponse
          });

      }
  }, [deleteGeneralResponse, deleteGeneralError, dispatch]);


  function findBudget(month: number) {
    return summaryState.summary?.budgets?.find((b) => b.month === month);
  }

  return (
    <div className="general table">
      <h4>Presupuesto general</h4>
      <table>
        <thead>
          <tr>
            <th>Mes</th>
            <th>Presupuesto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {allMonths.map((monthNum) => {
            const budget = findBudget(monthNum);
            const withBudget = budget?.general && budget.general > 0;
            return (
              <tr key={monthNum}>
                <td className="month-cell">{getMonthName({ num: monthNum })}</td>
                <td className={budget?.general && budget.general > 0 ? "" : "not-found-message"}>
                  {budget?.general && budget.general > 0 ? `${budget.general} ${userInfo?.currency}` : "No establecido"}
                </td>
                <td>
                  {!withBudget ? (
                    <button onClick={() => onOpenModal(year, monthNum, undefined, budget?.general)}>
                      Agregar presupuesto
                    </button>
                  ) : (
                    <>
                      <button onClick={() => onOpenModal(year, monthNum, undefined, budget?.general)}>
                        Editar presupuesto
                      </button>
                      <button onClick={() => handleGeneralBudgetDelete(year, monthNum)}>Borrar presupuesto</button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

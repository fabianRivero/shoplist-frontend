import React, { useCallback, useContext, useEffect } from "react";
import { SummarySectorItem } from "./components/SummarySectorItem";
import { SummaryContext } from "./context/summaryContext";
import { Summary } from "./models/summaryModel";
import { summaryService } from "./services/summaryService";
import { useAxios } from "../../shared/hooks/useAxios";
import { SummaryActionType } from "./models/summaryState";
import { PurchaseContext } from "../shop-list/context/ShopListContext";
import { capitalize, getMonthName } from "../../shared/services";
import "./summary-container.scss"

type Props = {
    date?: string;
    period?: string;
    sector?: string
}

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");
const localDate = `${year}-${month}-${day}`;

export const SummaryContainer = ({date = localDate, period = "month", sector}: Props) => {

  const summaryContext = useContext(SummaryContext);
  const { state: purchaseState } = useContext(PurchaseContext);
  
  const serviceCall = useCallback(() => summaryService.getSummary(date, period, sector), [date, period, sector])
  const { isLoading, data: summary, error, executeFetch } = useAxios<void, Summary>({
      serviceCall,
      trigger: true
  })

  function getMonthNumber(date: string){
    return date.slice(5, 7);
  }  

  function getCurrentBudget(summary: Summary | null, currentMonth: number, currentYear: number) {
    if (!summary || !summary.budgets) return null;
      
    const budget = summary.budgets.find(
      (b) => b.month === currentMonth && b.year === currentYear
    );
    return budget;
  }

  const monthNumber = getMonthNumber(date)
  const currentBudget = getCurrentBudget(summary, Number(monthNumber), year);

  useEffect(() => {
     if(summary){
      summaryContext.dispatch({ type: SummaryActionType.GET, payload: summary })
     } 

  }, [summary]);

  useEffect(() => {
    executeFetch();
  }, [purchaseState, executeFetch]);

  if(isLoading) return <p>Cargando productos...</p>
  if(error) return <p>Error: {error}</p>

  return (
    <>
      {summary === null && currentBudget === null ? (
        <h3 className="not-found-message">no hay resumen disponible</h3>
      ) : (
        <div className="summary">
          <span className="month">{capitalize(getMonthName({ num: Number(monthNumber) }))} - {year}</span>
          <h3>Gasto general: {summary?.totalSpent}$</h3>

          {summary?.totalSpent ? (
          <>
            <div className="by-sector">
              <h4>Gastos por sector:</h4>
              <ul className="sector-list"> 
                {summary?.spentBySector ? (
                  Object.entries(summary.spentBySector).map(([sector, amount]) => (
                    <SummarySectorItem key={sector} sector={sector} expense={amount} type="expense" />
                  ))
                ) : (
                  <div></div>
                )}
              </ul>
            </div>

            {summary?.budgets ? (
              summary.budgets.map((monthBudget) => {  
                return (
                  <React.Fragment key={`${monthBudget.year}-${monthBudget.month}`}>
                    {monthBudget.general === 0 ? (
                      <div></div>
                    ) : (
                    <h3>Presupuesto mensual restante: {monthBudget.general - summary.totalSpent}$</h3>
                    )}
                    {monthBudget.sectors && monthBudget.sectors.length > 0 ? (
                    <div className="by-sector">
                      <h4>Presupuesto por sector:</h4>
                      <ul className="sector-list">
                        {monthBudget.sectors && monthBudget.sectors.length > 0  ? (
                          monthBudget.sectors.map(({ sector, budget = 0 }) => ( 
                            <SummarySectorItem key={sector} sector={sector} budget={budget} type="budget" />
                          ))
                        ) : (
                          <p className="not-found-message">Presupuesto no establecido</p>
                        )}
                      </ul>
                    </div>
                    ) : (
                      <h4 className="not-found-message">Presupuesto no establecido</h4>
                    )}
                  </React.Fragment>   
                )}
              )
            ) : (
              <div></div>
            )}  

          </>
          ) : (
            <div></div>
          )}

        </div>
      )}
    </>
  );
};

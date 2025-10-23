import React, { useCallback, useContext, useEffect } from "react";
import { SummarySectorItem } from "./components/SummarySectorItem";
import { SummaryContext } from "./context/summaryContext";
import { Summary } from "./models/summaryModel";
import { summaryService } from "./services/summaryService";
import { useAxios } from "../../shared/hooks/useAxios";
import { SummaryActionType } from "./models/summaryState";
import { PurchaseContext } from "../shop-list/context/ShopListContext";
import { capitalize, getMonthName, TokenStorage } from "../../shared/services";
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

  const usertoken = TokenStorage.getToken();  
  const userInfo = usertoken ? TokenStorage.decodeToken(usertoken) : undefined;

  
  const serviceCall = useCallback(() => summaryService.getSummary(date, period, sector), [date, period, sector])
  const { isLoading, data: summary, error, executeFetch } = useAxios<void, Summary>({
      serviceCall,
      trigger: true
  })

  function getMonthNumber(date: string){
    if (date === localDate){
      return date.slice(5, 7);
    } else{
      const monthName = date.slice(4, 7);

      const months = Array.from({ length: 12 }, (_, i) =>
        new Date(2000, i, 1)
          .toLocaleString('en-EN', { month: 'short' })
          .slice(0, 3)
          .toLowerCase()
      );

      const index = months.indexOf(monthName.toLowerCase());
      return index !== -1 ? index + 1 : null;
    }
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

  const calendarYear = () => {
    if (date === localDate){
      return year
    } else{
      return date.slice(11, 15)
    }
  }
  
  return (
    <>
      {summary === null && currentBudget === null ? (
        <h3 className="not-found-message">no hay resumen disponible</h3>
      ) : (
        <div className="summary">
          <span className="month">{capitalize(getMonthName({ num: Number(monthNumber) }))} - {calendarYear()}</span>
          <h3>Gasto general: {(summary?.totalSpent)?.toFixed(2)} {userInfo?.currency}</h3>

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
                    <h3>Presupuesto mensual restante: {monthBudget.general - summary.totalSpent} {userInfo?.currency}</h3>
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

import React, { useCallback, useContext, useEffect } from "react";
import { SummarySectorItem } from "./components/SummarySectorItem";
import { SummaryContext } from "./context/summaryContext";
import { Budget, Summary } from "./models/summaryModel";
import { summaryService } from "./services/summaryService";
import { useAxios } from "../../shared/hooks/useAxios";
import { SummaryActionType } from "./models/summaryState";
import { PurchaseContext } from "../shop-list/context/ShopListContext";

export const SummaryContainer = () => {

  const summaryContext = useContext(SummaryContext);
  const { state: purchaseState } = useContext(PurchaseContext);
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const localDate = `${year}-${month}-${day}`;
  const serviceCall = useCallback(() => summaryService.getSummary(localDate, "month"), [localDate])
  const { isLoading, data: summary, error, executeFetch } = useAxios<void, Summary>({
      serviceCall,
      trigger: true
  })

  function getCurrentBudget(summary: Summary | null, currentMonth: number, currentYear: number) {
    if (!summary || !summary.budgets) return null;
      
    const budget = summary.budgets.find(
      (b) => b.month === currentMonth && b.year === currentYear
    );
    return budget;
  }

  const currentBudget = getCurrentBudget(summary, Number(month), year);

  function getTotalSpentFromBudget(currentBudget: Budget | null | undefined) {
    if (!currentBudget) return 0;
    return currentBudget.sectors.reduce((sum, sector) => sum + sector.spent, 0);
  }

  const totalSpent = getTotalSpentFromBudget(currentBudget);

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
    <div>
      <div>
        {summary === null && currentBudget === null ? (
          <p>no hay resumen disponible</p>
        ) : (
          <>
            <h3>Gasto general: ${totalSpent}</h3>

            {summary?.totalSpent ? (
            <h4>Gastos por sector:</h4> 
            ) : (
              <div></div>
            )}
            <ul>
              {summary?.spentBySector ? (
                Object.entries(summary.spentBySector).map(([sector, amount]) => (
                  <SummarySectorItem key={sector} sector={sector} expense={amount} type="expense" />
                ))
              ) : (
                <div></div>
              )}
            </ul>
            <div>
              
              {summary?.budgets ? (
                summary.budgets.map((monthBudget) => {
    
                  return (
                    <React.Fragment key={`${monthBudget.year}-${monthBudget.month}`}>
                      {monthBudget.general === 0 ? (
                        <div></div>
                      ) : (
                      <h3>Presupuesto mensual restante: ${monthBudget.general - summary.totalSpent}</h3>
                      )}
                      {}
                      {monthBudget.sectors && monthBudget.sectors.length > 0 ? (
                      <>
                      <h4>Presupuesto por sector:</h4>
                      <ul>
                        {monthBudget.sectors && monthBudget.sectors.length > 0  ? (
                          monthBudget.sectors.map(({ sector, budget = 0 }) => ( 
                            <SummarySectorItem key={sector} sector={sector} budget={budget} type="budget" />
                          ))
                        ) : (
                          <p>Presupuesto no establecido</p>
                        )}
                      </ul>
                      </>
                      ) : (
                        <div><h4>Presupuesto no establecido</h4></div>
                      )}
                    </React.Fragment>   
                  )}
                )
              ): (
                <div></div>
              )}  

            </div>
          </>
        )}
      </div>
    </div>
  );
};

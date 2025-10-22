import { useCallback, useContext } from "react"
import { ModalContext } from "../../../shared/components/modal/context";
import { summaryService } from "../../summary/services/summaryService";
import { useAxios } from "../../../shared/hooks/useAxios";
import { Summary } from "../../summary/models/summaryModel";
import "./styles/details-table.scss";
import { TokenStorage } from "../../../shared/services";

type Expense = {
  sector: string;
  expenses: number;
  budget: number;
};

export const DetailsTable = () => {
    const { state: modalState } = useContext(ModalContext)

    const usertoken = TokenStorage.getToken();  
    const userInfo = usertoken ? TokenStorage.decodeToken(usertoken) : undefined;

    const itemRegister = modalState.data?.dataToUse?.register 

    const year = itemRegister?.startDate.slice(0, 4);
    const month = itemRegister?.startDate.slice(5, 7);
    const day = itemRegister?.startDate.slice(8, 10);
    const date = `${year}-${month}-${day}`;
    const period = itemRegister?.period || "month";

    
    const serviceCall = useCallback(() => summaryService.getSummary(date, period), [date, period])
    const { data: summary } = useAxios<void, Summary>({
        serviceCall,
        trigger: true
    })

    const getTableData = () => {
        const dataArray: Expense[] = [];
        const sectorSet = new Set<string>

        summary?.budgets?.forEach((budget) => {
            budget.sectors.forEach((sector) => {
                sectorSet.add(sector.sector)
          })
        })

        const sectorArray = Array.from(sectorSet)

        sectorArray.forEach((existingSector: string) => {
            let sectorExpenses = 0;
            let sectorBudget = 0;
            summary?.budgets?.forEach((budget) => {

                budget.sectors.forEach((sector) => {
                    if(sector.sector === existingSector){
                        sectorExpenses += sector.spent
                        sectorBudget += sector.budget || 0 
                    }
                })


            })

            dataArray.push({sector: existingSector, expenses: sectorExpenses, budget: sectorBudget})
        })

        return dataArray
    }

    const tableData = getTableData();

    return(
        <table className="details-table">
            <thead>
                <tr>
                    <th>Sector</th>
                    <th>Gastos</th>
                    {summary?.period === "month" && <th>Presupuesto establecido</th>}
                </tr>
            </thead>

            <tbody>
                {tableData.map((data) => (
                    <tr key={data.sector}>
                        <th>{data.sector}</th>
                        <td>{data.expenses} {userInfo?.currency}</td>
                        {summary?.period === "month" && data.budget !== 0 ? <td>{data.budget} {userInfo?.currency}</td> :
                        summary?.period === "month" ? <td><p className="not-found-message">No establecido</p></td> : <></>}
                    </tr>
                ))}
                {
                    summary?.period === "month" && 
                        <tr>
                            <th>General</th>
                            <td>{summary?.totalSpent} {userInfo?.currency}</td>
                            <td>{
                                summary && summary.budgets && (
                                    summary.budgets[0].general
                                ) 
                            } {userInfo?.currency}</td>
                        </tr>

                }

            </tbody>
        </table>
    )
}
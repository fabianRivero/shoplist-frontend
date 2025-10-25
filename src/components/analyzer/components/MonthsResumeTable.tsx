import { useCallback, useContext } from "react"
import { ModalContext } from "../../../shared/components/modal/context";
import { summaryService } from "../../summary/services/summaryService";
import { useAxios } from "../../../shared/hooks/useAxios";
import { Summary } from "../../summary/models/summaryModel";
import "./styles/details-table.scss";
import { getMonthName, TokenStorage } from "../../../shared/services";

type MonthResume = {
  month: number;
  expenses: number;
};

export const MonthResumeTable = () => {
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
        const dataArray: MonthResume[] = [];
        const monthSet = new Set<number>
        summary?.budgets?.forEach((budget) => {
            monthSet.add(budget.month)
        })

        const monthArray = Array.from(monthSet)

        monthArray.forEach((existingMonth: number) => {
            let monthExpenses = 0;
            summary?.budgets?.forEach((budget) => {

                budget.sectors.forEach((sector) => {
                    if(budget.month === existingMonth){
                        monthExpenses += sector.spent
                    }
                })


            })

            dataArray.push({ month: existingMonth, expenses: monthExpenses })
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
                    <tr key={data.month}>
                        <th>{getMonthName({num: data.month})}</th>
                        <td>{data.expenses.toFixed(2)} {userInfo?.currency}</td>
                        { summary?.period === "month" ? <td><p className="not-found-message">No establecido</p></td> : <></> }
                    </tr>
                ))}
                
                    <tr>
                        <th>General</th>
                        <td>{summary?.totalSpent.toFixed(2)} {userInfo?.currency}</td>
                    </tr>
            </tbody>
        </table>
    )
}
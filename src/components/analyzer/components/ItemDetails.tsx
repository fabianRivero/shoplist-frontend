import { register } from "../models/analyzerModel"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useCallback } from "react";
import { summaryService } from "../../summary/services/summaryService";
import { useAxios } from "../../../shared/hooks/useAxios";
import { Summary } from "../../summary/models/summaryModel";
import { PieChart } from "./PieChart";
import { DetailsTable } from "./DetailsTable";
import "./styles/item-details.scss";

interface Props {
    item: register
}

ChartJS.register(ArcElement, Tooltip, Legend);

export const ItemDetails = ({ item }: Props) => {
    const year = item.register.startDate.slice(0, 4);
    const month = item.register.startDate.slice(5, 7);
    const day = item.register.startDate.slice(8, 10);
    const date = `${year}-${month}-${day}`;

    const period = item.register.period;

    const serviceCall = useCallback(() => summaryService.getSummary(date, period), [date, period])
    const { data: summary } = useAxios<void, Summary>({
        serviceCall,
        trigger: true
    })

    const getAllData = ()  => {
        const expensesSectorSet = new Set<string>();
        const budgetsSectorSet = new Set<string>();

        if (summary?.budgets){
            summary?.budgets.forEach((budget) => {
                budget.sectors.forEach((sector) => {
                    expensesSectorSet.add(sector.sector);
                })

                if(budget.general > 0){
                    budget.sectors.forEach((sector) => {
                        if(sector.budget && sector.budget > 0) 
                            budgetsSectorSet.add(sector.sector)
                    })
                }
            })
        }
            
        const expensesSectorArray = Array.from(expensesSectorSet)
        const budgetsSectorArray = Array.from(budgetsSectorSet)

        const data = (sectorArray: Array<string>, datatype: "expenses" | "budgets"): Array<{ 
            existingSector: string, total: number } | undefined
            > => {
            return sectorArray.map((existingSector) => {
                let total = 0;

                if(summary?.budgets){
                    summary?.budgets.forEach((budget) => {
                        budget.sectors.forEach((sector) => {
                            if (sector.sector === existingSector) {
                                if(datatype === "expenses"){
                                    total += sector.spent
                                } else {
                                    total = sector.budget || 0
                                }
                            }
                        })
                    })

                    return { existingSector, total }
                }
                return;
            })
        } 
        const expensesData = data(expensesSectorArray, "expenses");
        const budgetsData = data(budgetsSectorArray, "budgets"); 

        return { expensesData, budgetsData }
    }

    const expensesSectorsLabels = getAllData().expensesData.map((data) => data?.existingSector)
    const expensesSectorsData = getAllData().expensesData.map((data) => data?.total)

    const budgetsSectorsLabels = getAllData().budgetsData.map((data) => data?.existingSector)
    const budgetsSectorsData = getAllData().budgetsData.map((data) => data?.total)

    return(
        <section className="item-details">
            <h2>Detalles del item</h2>
            
            <div className="pie-charts-container">
                <PieChart graficSectors={expensesSectorsLabels} graficData={expensesSectorsData}/>
                {item.register.period === "month" && <PieChart graficSectors={budgetsSectorsLabels} graficData={budgetsSectorsData}/>}
                
            </div>


            <DetailsTable/>

        </section>
    )
}
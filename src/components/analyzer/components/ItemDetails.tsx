import { register } from "../models/analyzerModel"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useCallback, useEffect, useMemo, useState } from "react";
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

    const [expensesExist, setExpensesExist] = useState(false);

    const period = item.register.period;

    const serviceCall = useCallback(() => summaryService.getSummary(date, period), [date, period])
    const { data: summary } = useAxios<void, Summary>({
        serviceCall,
        trigger: true
    })

    const { expensesData, budgetsData } = useMemo(() => {
    if (!summary?.budgets) return { expensesData: [], budgetsData: [] };
    
    const expensesSectorSet = new Set<string>();
    const budgetsSectorSet = new Set<string>();

    summary.budgets.forEach((budget) => {
        budget.sectors.forEach((sector) => {
        expensesSectorSet.add(sector.sector);
        if (budget.general > 0 && sector.budget && sector.budget > 0)
            budgetsSectorSet.add(sector.sector);
        });
    });

    const buildData = (sectorArray: string[], type: "expenses" | "budgets") =>
        sectorArray.map((sectorName) => {
        let total = 0;
        summary.budgets?.forEach((budget) => {
            budget.sectors.forEach((sector) => {
            if (sector.sector === sectorName) {
                total += type === "expenses" ? sector.spent : sector.budget || 0;
            }
            });
        });
        return { existingSector: sectorName, total };
        });

    return {
        expensesData: buildData(Array.from(expensesSectorSet), "expenses"),
        budgetsData: buildData(Array.from(budgetsSectorSet), "budgets"),
    };
    }, [summary]);

    const expensesSectorsLabels = expensesData.map(d => d.existingSector);
    const expensesSectorsData = expensesData.map(d => d.total);
    const budgetsSectorsLabels = budgetsData.map(d => d.existingSector);
    const budgetsSectorsData = budgetsData.map(d => d.total);


    useEffect(() => {
    const hasExpenses = expensesSectorsData.some((data) => data && data > 0);
    setExpensesExist(hasExpenses);
    }, [expensesSectorsData]);


    return(
        <section className="item-details">
            <h2>Detalles del item</h2>
            
            <div className="pie-charts-container">
                {expensesSectorsLabels.length > 0 && expensesSectorsData.length > 0 ? ( 
                    <>
                        {expensesSectorsLabels && expensesSectorsData && expensesExist ?
                            <PieChart graficSectors={expensesSectorsLabels} graficData={expensesSectorsData} dataType="expenses" summaryData={summary}/>
                            :
                            <div className="not-found-message">No hay gastos que analizar en este item.</div>
                        }
                        
                        { budgetsSectorsLabels.length > 0 && budgetsSectorsData.length > 0 && item.register.period === "month" ? 
                            <PieChart graficSectors={budgetsSectorsLabels} graficData={budgetsSectorsData} dataType="budgets" summaryData={summary} />
                        :  
                            <div className="not-found-message">No hay presupuestos que analizar en este item.</div>
                        }   
                    </>
                ) : (
                        <div className="not-found-message">No hay datos que analizar en este item.</div> 
                    )
                }
                
                
            </div>


            <DetailsTable/>

        </section>
    )
}
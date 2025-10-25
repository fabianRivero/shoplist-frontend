import { TooltipItem } from "chart.js";
import { Pie } from "react-chartjs-2";
import "./styles/pie-chart.scss";
import { TokenStorage } from "../../../shared/services";
import { Summary } from "../../summary/models/summaryModel";
import { useCallback, useContext, useMemo } from "react";
import { useAxios } from "../../../shared/hooks/useAxios";
import { summaryService } from "../../summary/services/summaryService";
import { ModalContext } from "../../../shared/components/modal/context";

interface Props {
  dataType: "expenses" | "budgets";
}

export const PieChart = ({  dataType }: Props) => {  
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
  const expensesSectorsData = expensesData.map(d => d.total.toFixed(2));
  const budgetsSectorsLabels = budgetsData.map(d => d.existingSector);
  const budgetsSectorsData = budgetsData.map(d => d.total.toFixed(2));

  const getColor = (sectorsLabels: Array<string | undefined>) =>
    sectorsLabels.map((_, i) => `hsl(${(i * 360) / sectorsLabels.length}, 70%, 50%)`);

  const chartData = useMemo(() => {
    if (dataType === "expenses") {
      return {
        labels: expensesSectorsLabels,
        datasets: [
          {
            label: "Distribución mensual",
            data: expensesSectorsData,
            backgroundColor: getColor(expensesSectorsLabels),
            borderColor: "#fff",
            borderWidth: 2,
          },
        ],
      };
    } else {
      const sectorsDataSum = budgetsSectorsData.reduce((acc, current) => {
        if (typeof current === "number" && !isNaN(current) && typeof acc === "number" && !isNaN(acc)) 
            return acc + current;
        return acc;
      }, 0);

      const totalBudget = summary?.budgets?.[0]?.general ?? 0;
      const difference = sectorsDataSum && totalBudget - sectorsDataSum;

      return {
        labels: [...budgetsSectorsLabels, "No definido"],
        datasets: [
          {
            label: "Distribución mensual",
            data: [...budgetsSectorsData, difference],
            backgroundColor: getColor([...budgetsSectorsLabels, "No definido"]),
            borderColor: "#fff",
            borderWidth: 2,
          },
        ],
      };
    }
  }, [expensesSectorsLabels, expensesSectorsData, dataType, summary, budgetsSectorsData, budgetsSectorsLabels]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"pie">) {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: ${value} ${userInfo?.currency}`;
          },
        },
      },
      title: {
        display: true,
        text: `Gráfica de ${dataType === "expenses" ? "gastos" : "presupuestos"}`,
      },
    },
  };

  const legendLabels =
    dataType === "budgets"
      ? [...budgetsSectorsLabels, "No definido"]
      : expensesSectorsLabels;

  return (
    <div className="chart-wrapper">
      <Pie data={chartData} options={options} />
      <div className="custom-legend">
        {legendLabels.map((label, i) => (
          <div key={i} className="legend-item">
            <span
              className="legend-color"
              style={{ backgroundColor: getColor(legendLabels)[i] }}
            />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

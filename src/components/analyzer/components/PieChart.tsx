import { TooltipItem } from "chart.js";
import { Pie } from "react-chartjs-2";
import "./styles/pie-chart.scss";
import { TokenStorage } from "../../../shared/services";
import { Summary } from "../../summary/models/summaryModel";
import { useMemo } from "react";

type Data<D> = D | null;

interface Props {
  graficSectors: Array<string | undefined>;
  graficData: Array<number | undefined>;
  dataType: "expenses" | "budgets";
  summaryData: Data<Summary>;
}

export const PieChart = ({ graficSectors, graficData, dataType, summaryData }: Props) => {
  const usertoken = TokenStorage.getToken();  
  const userInfo = usertoken ? TokenStorage.decodeToken(usertoken) : undefined;

  const getColor = (sectorsLabels: Array<string | undefined>) =>
    sectorsLabels.map((_, i) => `hsl(${(i * 360) / sectorsLabels.length}, 70%, 50%)`);

  const chartData = useMemo(() => {
    if (dataType === "expenses") {
      return {
        labels: graficSectors,
        datasets: [
          {
            label: "Distribución mensual",
            data: graficData,
            backgroundColor: getColor(graficSectors),
            borderColor: "#fff",
            borderWidth: 2,
          },
        ],
      };
    } else {
      const sectorsDataSum = graficData.reduce((acc, current) => {
        if (typeof current === "number" && !isNaN(current) && typeof acc === "number" && !isNaN(acc)) 
            return acc + current;
        return acc;
      }, 0);

      const totalBudget = summaryData?.budgets?.[0]?.general ?? 0;
      const difference = sectorsDataSum && totalBudget - sectorsDataSum;

      return {
        labels: [...graficSectors, "No definido"],
        datasets: [
          {
            label: "Distribución mensual",
            data: [...graficData, difference],
            backgroundColor: getColor([...graficSectors, "No definido"]),
            borderColor: "#fff",
            borderWidth: 2,
          },
        ],
      };
    }
  }, [graficSectors, graficData, dataType, summaryData]);

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
      ? [...graficSectors, "No definido"]
      : graficSectors;

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

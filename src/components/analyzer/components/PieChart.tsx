import { TooltipItem } from "chart.js";
import { Pie } from "react-chartjs-2";
import "./styles/pie-chart.scss";

interface Props{
    graficSectors: Array<string | undefined>,
    graficData: Array<number | undefined>
} 

export const PieChart = ({ graficSectors, graficData }: Props) => {

    const data = (sectorsLabels: Array<string | undefined>, sectorsData: Array<number | undefined>) => {
        return {
            labels: sectorsLabels,
            datasets: [
                {
                    label: "Distribución mensual",
                    data: sectorsData,
                    backgroundColor: getColor(sectorsLabels),
                    borderColor: "#fff",
                    borderWidth: 2,
                },
            ],
        }        
    };

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
                    return `${label}: ${value}`;
                },
                },
            },
            layout: {
                padding: 10, 
            },
            elements: {
                arc: {
                borderWidth: 2,
                radius: "90%", 
                },
            },
        },
    };

    const getColor = (sectorsLabels: Array<string | undefined>) => 
        sectorsLabels.map((_, i) => `hsl(${(i * 360) / sectorsLabels.length}, 70%, 50%)`)   



    return(
        <div className="chart-wrapper">
            <Pie data={data(graficSectors, graficData)} options={options} />

            <div className="custom-legend">
                {graficSectors.map((label, i) => (
                    <div key={i} className="legend-item">
                    <span 
                        className="legend-color" 
                        style={{ backgroundColor: getColor(graficSectors)[i] }}
                    />
                    {label}
                    </div>
                ))}
            </div>
        </div>
    )

}
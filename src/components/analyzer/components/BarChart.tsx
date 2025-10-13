import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useContext, useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { AnalyzerContext } from '../context/analyzerContext';
import { getMonthName } from '../../../shared/services';
import { register } from '../models/analyzerModel';
import "./styles/bar-chart.scss";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const BarChart = () => {

  const { state } = useContext(AnalyzerContext);
  const [sector, setSector] = useState<string>("General");

  const sectors = useMemo(() => {
      const sectorSet = new Set<string | undefined>()

      state.items.forEach(item => {
          item.register.logs.forEach(log => {
              log.purchases.forEach(purchase => {
              sectorSet.add(purchase.sector)
              })
          })
      })
      return Array.from(sectorSet)
  }, [state.items])

  const formattedDate = (data: string) => {
      const month = getMonthName({num: Number(data.slice(5, 7))})

      const year = data.slice(0, 4)

      const date = state.period === "month" ? `${month.slice(0, 3)}/${year}` : year;

      return date
  }

  const getTotal = (item: register) => {
      let count = 0
      item.register.logs.forEach(log => {
        if (sector === "General"){ 
          log.purchases.forEach(purchase => {
           count += (purchase.purchaseQuantity * purchase.price)
          })
        } else {
          log.purchases.forEach(purchase => {
            if (purchase.sector === sector) {
              count += (purchase.purchaseQuantity * purchase.price)
            }
          })
        }
      })
      return count
  }
  
  const itemDates = useMemo(() => {
      const dateSet = new Set<string>()

      state.items.forEach(item => {
          dateSet.add(item.register.startDate)

      })
      return Array.from(dateSet)
  }, [state.items])

  const monthLabels = itemDates.map(date => formattedDate(date));
  const totals = state.items.map(item => getTotal(item));

  const data = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Gastos',
        data: totals,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Comparación de gastos en ${sector}`,
      },
    },
  };
 
  return (
    <>
      <label>
        <select 
            name="sectors" 
            id="sector-select" 
            value={sector} 
            onChange={(e) => setSector(e.target.value)}>
              <option value="General">General</option>
              {
                  sectors.map((sector) => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))
              }
        </select>
      </label>
  
      <Bar data={data} options={options} />
    </>
  )
}
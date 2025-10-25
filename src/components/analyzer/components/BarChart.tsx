import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { AnalyzerContext } from '../context/analyzerContext';
import { getMonthName, TokenStorage } from '../../../shared/services';
import { TooltipItem } from "chart.js";
import "./styles/bar-chart.scss";
import { summaryService } from '../../summary/services/summaryService';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface sectorInfoProps {
  sector: string,
  spent: number,
  budget: number,
}

export const BarChart = () => {

  const { state } = useContext(AnalyzerContext);
  const [sector, setSector] = useState<string>("General");
  const [itemInfo, setItemInfo] = useState<{ sectorInfo: sectorInfoProps[]; generalBudget: number | null; generalSpent: number | null}[]>([]);

  const getInfo = async (date: string, period: string) => {
    const year = date.slice(0, 4);
    const month = date.slice(5, 7);
    const day = date.slice(8, 10);

    const usedDate = `${year}-${month}-${day}`
    
    const sectorInfo: sectorInfoProps[] = []

    const data = await summaryService.getSummary(usedDate, period)
    
    data.budgets?.forEach((budget) => {
      budget.sectors.forEach((sector) => {
        sectorInfo.push({sector: sector.sector, spent: sector.spent, budget: sector.budget || 0})
      })
    })

    const generalBudget = data.budgets && data.budgets.length > 0  ? data.budgets[0].general : null;
    const generalSpent = data.totalSpent ? data.totalSpent : null

    return({ sectorInfo, generalBudget, generalSpent })
  } 

  useEffect(() => {
    const fetchAll = async () => {
      if (state.items.length === 0) return;

      const promises = state.items.map((item) =>
        getInfo(item.register.startDate, state.period)
      );

      const results = await Promise.all(promises);
      setItemInfo(results);
    };

    fetchAll();
  }, [state.items, state.period]);

  const usertoken = TokenStorage.getToken();  
  const userInfo = usertoken ? TokenStorage.decodeToken(usertoken) : undefined;

  const formattedDate = (data: string) => {
      const month = getMonthName({num: Number(data.slice(5, 7))})

      const year = data.slice(0, 4)

      const date = state.period === "month" ? `${month.slice(0, 3)}/${year}` : year;

      return date
  }

  const sectors = useMemo(() => {
    const sectorSet = new Set<string>();

    itemInfo.forEach((item) => {
      item.sectorInfo.forEach((sector) => {
        sectorSet.add(sector.sector)
      })
    })
    return Array.from(sectorSet)
  }, [itemInfo]) 
  

  const itemDates = useMemo(() => {
      const dateSet = new Set<string>()

      state.items.forEach(item => {
          dateSet.add(item.register.startDate)

      })
      return Array.from(dateSet)
  }, [state.items])

  const monthLabels = itemDates.map(date => formattedDate(date));

  const totals = useMemo(() => {
    const spentInfo: (number | null)[] = []
    const budgetInfo: (number | null)[] = []
    itemInfo.forEach((item) => {
      if(sector === "General"){
          spentInfo.push(item.generalSpent)
          budgetInfo.push(item.generalBudget)
      } else{
          item.sectorInfo.forEach((sec) => {
            if(sector === sec.sector){
              spentInfo.push(sec.spent)
              budgetInfo.push(sec.budget)
            }   
        })
      }
    })

    return { spentInfo, budgetInfo }
    
  }, [itemInfo, sector])

  const spentData = totals.spentInfo.map((n) => {
    return n?.toFixed(2)
  })
  
  const budgetData = totals.budgetInfo.map((n) => {
    return n?.toFixed(2)
  })

  const data = state.period !== "year" ? {
    labels: monthLabels,
    datasets: [
      {
        label: 'Gastos',
        data: spentData,
        backgroundColor: 'rgba(255, 0, 0, 0.6)',
      },
      {
        label: 'Presupuestos',
        data: budgetData,
        backgroundColor: 'rgba(0, 255, 0, 0.6)',
      },
    ],
  } : {
    labels: monthLabels,
    datasets: [
      {
        label: 'Gastos',
        data: spentData,
        backgroundColor: 'rgba(255, 0, 0, 0.6)',
      },
    ],
  }

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
          callbacks: {
          label: function (context: TooltipItem<"bar">) {
              const label = context.label || "";
              const value = context.raw || 0;
              return `${label}: ${value} ${userInfo?.currency}`;
          },
          },
      },
      title: {
        display: true,
        text: `Comparación de gastos en ${sector}`,
      },
    },
  };
 
  return (
    <div className='bar-chart'>
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
      <div 
        className='graphic-container'
        style={{ height: `${Math.max(300, monthLabels.length * 60)}px` }}      
      >
        <Bar 
          key={monthLabels.length} 
          data={data} 
          options={options} 
        />      
      </div>
    </div>
  )
}
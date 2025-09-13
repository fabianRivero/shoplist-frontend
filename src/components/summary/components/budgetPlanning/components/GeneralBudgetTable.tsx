import { getMonth } from "../../../../../shared/services";
import { Budget } from "../../../models/summaryModel";
import "./styles/table.scss";

interface GeneralBudgetTableProps {
  year: number;
  budgets?: Budget[];
  onOpenModal: (year: number, month: number, sector?: string, amount?: number) => void;
  onDelete: (year: number, month: number) => void;
}

export const GeneralBudgetTable = ({ year, budgets, onOpenModal, onDelete }: GeneralBudgetTableProps) => {
  const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);

  function findBudget(month: number) {
    return budgets?.find((b) => b.month === month);
  }

  return (
    <div className="general table">
      <h4>Presupuesto general</h4>
      <table>
        <thead>
          <tr>
            <th>Mes</th>
            <th>Presupuesto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {allMonths.map((monthNum) => {
            const budget = findBudget(monthNum);
            const withBudget = budget?.general && budget.general > 0;
            return (
              <tr key={monthNum}>
                <td className="month-cell">{getMonth({ num: monthNum })}</td>
                <td className={withBudget ? "" : "not-found-message"}>
                  {withBudget ? `${budget.general} USD` : "No establecido"}
                </td>
                <td>
                  {!withBudget ? (
                    <button onClick={() => onOpenModal(year, monthNum, undefined, budget?.general)}>
                      Agregar presupuesto
                    </button>
                  ) : (
                    <>
                      <button onClick={() => onOpenModal(year, monthNum, undefined, budget?.general)}>
                        Editar presupuesto
                      </button>
                      <button onClick={() => onDelete(year, monthNum)}>Borrar presupuesto</button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

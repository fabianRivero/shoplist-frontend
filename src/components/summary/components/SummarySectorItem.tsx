import { capitalize, TokenStorage } from "../../../shared/services";
import "./summary-sector-item.scss"

interface Props {
  sector: string;
  expense?: number;
  budget?: number;
  type?: "expense" | "budget";
}

export const SummarySectorItem = ({ sector, expense, budget, type }: Props) => {
    const usertoken = TokenStorage.getToken();  
    const userInfo = usertoken ? TokenStorage.decodeToken(usertoken) : undefined;
    
  return (
    <>
      {type === "budget" ? (
        <li className="summary-item">
          <span className="sector-name">{capitalize(sector)}:</span>{" "}
          {budget === undefined || budget === 0 ? (
            <span className="not-found-message">Presupuesto no establecido</span>
          ) : (
            <span>{budget}$</span>
          )}
        </li>
      ) : (
        <li className="summary-item">
          <span className="sector-name">{capitalize(sector)}:</span>{" "}
          <span>{expense} {userInfo?.currency}</span>
        </li>
      )}
    </>
  );
};

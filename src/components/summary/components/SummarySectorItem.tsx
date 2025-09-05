interface Props {
  sector: string;
  expense?: number;
  budget?: number;
  type?: "expense" | "budget";
}

export const SummarySectorItem = ({ sector, expense, budget, type }: Props) => {
  // console.log(sector, expense, budget)
  return (
    <>
      {type === "budget" ? (
        <li>
          <span>{sector}:</span>{" "}
          {budget === undefined || budget === 0 ? (
            <span>Presupuesto no establecido</span>
          ) : (
            <span>{budget}$</span>
          )}
        </li>
      ) : (
        <li>
          <span>{sector}:</span>{" "}
          <span>{expense}$</span>
        </li>
      )}
    </>
  );
};

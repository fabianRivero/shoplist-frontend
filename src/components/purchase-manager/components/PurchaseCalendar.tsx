import Calendar, { CalendarProps } from "react-calendar";
import { useCallback, useContext, useEffect, useState } from "react";
import { PurchaseContext } from "../../shop-list/context/ShopListContext";
import { useAxios } from "../../../shared/hooks/useAxios";
import { purchaseService } from "../../shop-list/services/shopListService";
import { getPeriodPurchasesResponse } from "../../shop-list/models/shopListModel";
import { PurchaseActionType } from "../../shop-list/models/purchaseListState";
import "react-calendar/dist/Calendar.css";
import "./purchase-calendar.scss"

type Props = {
  date: Date | null;
  handleChange: CalendarProps["onChange"];
};

export const PurchaseCalendar = ({ handleChange, date }: Props) => {
  const [purchaseDates, setPurchaseDates] = useState<string[]>([])
  const { state, dispatch } = useContext(PurchaseContext)
  const [monthDate, setMonthDate] = useState<Date>(date ?? new Date());

  const formattedForService = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}`;

  const getPurchasesServiceCall = useCallback(() => purchaseService.getPurchasesByCharacteristic("month", formattedForService ), [formattedForService])
  const { data: purchases } = useAxios<void, getPeriodPurchasesResponse>({
      serviceCall: getPurchasesServiceCall,
      trigger: true
  });

  const handleMonthChange: CalendarProps["onActiveStartDateChange"] = ({ activeStartDate }) => {
    if (activeStartDate) {
      setMonthDate(activeStartDate);
    }
  };

  useEffect(() => {
    if (purchases){
        if (purchases.register.logs.length > 0) {
            dispatch({ type: PurchaseActionType.MERGE, payload: purchases.register.logs })
        }
    } 
  }, [purchases, dispatch]) 

  useEffect(() => {

    const dates: string[] = [];

    state?.purchases.forEach((purchaseArray, purchaseDate) => {
      if (purchaseArray.length > 0 && purchaseDate) {
        const formatted = new Date(purchaseDate).toISOString().split("T")[0];
        dates.push(formatted);
      }
    });
    setPurchaseDates(dates);


  }, [state.purchases]);


  return (
    <Calendar
      onChange={handleChange}
      value={date ?? new Date()}
      onActiveStartDateChange={handleMonthChange}
      tileContent={({ date, view }) => {
        if (view === "month") {
          const formatted = date.toISOString().split("T")[0];
          if (purchaseDates?.includes(formatted)) {
            return <div style={{ color: "red", fontSize: "0.7em" }}>•</div>; 
          }
        }
        return null;
      }}
    />
  );
};
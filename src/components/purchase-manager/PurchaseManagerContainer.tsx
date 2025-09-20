import { useState } from "react";
import { PurchaseCalendar } from "./components/PurchaseCalendar";
import { ShopListContainer } from "../shop-list/ShopListContainer";
import { CalendarProps } from "react-calendar";
import { SummaryContainer } from "../summary/SummaryContainer";
import { useNavigate } from "react-router-dom";
import "./purchase-manager-container.scss";

export const PurchaseManagerContainer = () => {
  const [date, setDate] = useState<Date | null>(new Date());
  const navigate = useNavigate();

  const handleChange: CalendarProps["onChange"] = (value) => {
    if (!value) return;

    const selected = Array.isArray(value) ? value[0] : value;

    if (!selected) return;

    setDate(selected);
  };

  const goToList = () => {
    navigate("/item-list");
  }
  
  return (
    <div className="purchase-manager-container">
      <section className="calendar-container">
        <h2>Calendario de compras</h2>
        <PurchaseCalendar handleChange={handleChange} date={date} />
      </section>

      <section className="shopList-container">
        <div>
          <h2>lista de compras</h2>
          <button onClick={goToList} className="shop-item-button">Registrar compra</button>
        </div>
        
        <ShopListContainer period="day" baseDate={String(date)}/>
      </section>

      <SummaryContainer />

    </div>
  );
};

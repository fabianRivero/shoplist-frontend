import { useState, useContext } from "react";
import { PurchaseCalendar } from "./components/PurchaseCalendar";
import { ShopListContainer } from "../shop-list/ShopListContainer";
import { CalendarProps } from "react-calendar";
import { SummaryContainer } from "../summary/SummaryContainer";
import { useNavigate } from "react-router-dom";
import "./purchase-manager-container.scss";
import { ModalContext } from "../../shared/components/modal/context";

export const PurchaseManagerContainer = () => {
  const [date, setDate] = useState<Date | null>(new Date());
  const {setState} = useContext(ModalContext)
  const navigate = useNavigate();

  const formattedDate = String(date).slice(0, 16) + "00:00:00" + String(date).slice(24)

  const usedDate = new Date(formattedDate) 

  const handleChange: CalendarProps["onChange"] = (value) => {
    if (!value) return;

    const selected = Array.isArray(value) ? value[0] : value;

    if (!selected) return;

    setDate(selected);
  };

  const goToList = (date: string) => {
    if (!date) return;
    setState({open: false, data: {date: date, mode: "edit", form: "purchase"}})
    navigate("/item-list");

  }

  return (
    <div className="purchase-manager-container">
      <section className="calendar-container">
        <h2>Calendario de compras</h2>
        <PurchaseCalendar handleChange={handleChange} date={usedDate} />
      </section>

      <section className="shopList-container">
        <div className="shopList-container-title">
          <h2>Lista de compras</h2>
          <button onClick={() => goToList(String(usedDate))} className="shop-item-button">Registrar compra</button>
        </div>
        
        <ShopListContainer period="day" baseDate={String(usedDate)}/>
      </section>

      <section className="summary-container">
        <h2>Resumen de mes</h2>
        <SummaryContainer />
      </section>
    </div>
  );
};

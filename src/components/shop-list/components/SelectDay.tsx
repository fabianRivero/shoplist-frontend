import { useState } from "react";

const SelectDay = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const localDate = `${year}-${month}-${day}`;
    const [selectedDate, setSelectedDate] = useState<string>(localDate);

    return(
        <div style={{ marginBottom: "1rem" }}>
            <label>
            Fecha:{" "}
            <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
            />
            </label>
        </div>
    )    
}

export default SelectDay;

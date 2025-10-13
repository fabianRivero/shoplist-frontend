import React from "react";
import { register } from "../models/analyzerModel";
import { getMonthName } from "../../../shared/services";
import "./styles/analyzer-item.scss"

interface Props {
    item: register;
    period: string,
    children: React.ReactNode;
}

export const AnalyzerItem = ({ item, period, children }: Props) => {

    const formattedDate = () => {
        const month = getMonthName({num: Number(item.register.startDate.slice(5, 7))})

        const year = item.register.startDate.slice(0, 4)

        const date = period === "month" ? `${month.slice(0, 3)}/${year}` : year;

        return date
    }

    const date = formattedDate()

    return (
        <li className="analyzer-item">
            <div>{date}</div>
            {children}
        </li>
    )
}
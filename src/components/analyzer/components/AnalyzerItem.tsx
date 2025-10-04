import React from "react";
import { register } from "../models/analyzerModel";
import { getMonthName } from "../../../shared/services";
import "./styles/analyzer-item.scss"

interface Props {
    item: register;
    children: React.ReactNode;
}

export const AnalyzerItem = ({ item, children }: Props) => {

    const formattedDate = () => {
        const month = getMonthName({num: Number(item.register.startDate.slice(5, 7))})

        const year = item.register.startDate.slice(0, 4)

        const date = `${month} del ${year}`

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
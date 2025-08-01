import { ReactNode } from "react";
import { Purchase } from "../models/shopListModel";

interface Props {
    purchase: Purchase;
    children: ReactNode;
};

export const PurchaseItem = ({ purchase, children }: Props) => {
    return (
        <li>
            {purchase.name}
            {children}
        </li>
    )
}
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
            <div>Cantidad comprada: {purchase.purchaseQuantity} {purchase.unit} </div>
            <div>Precio: {purchase.price} {purchase.currency} </div>
            <div>Total: {purchase.price * purchase.purchaseQuantity} {purchase.currency} </div>
            {children}
        </li>
    )
}
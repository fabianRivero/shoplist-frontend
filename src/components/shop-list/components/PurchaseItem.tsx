import { ReactNode } from "react";
import { Purchase } from "../models/shopListModel";
import "./styles/purchase-item.scss";
import { capitalize } from "../../../shared/services";

interface Props {
    purchase: Purchase;
    children: ReactNode;
};

export const PurchaseItem = ({ purchase, children }: Props) => {

    return (
        <li className="purchase-item">
            <h4>{capitalize(purchase.name)}</h4>
            {purchase.sector && <div><h5>Sector:</h5> {capitalize(purchase.sector)}</div>}
            <div><h5>Cantidad comprada:</h5> {purchase.purchaseQuantity} {purchase.unit} </div>
            <div><h5>Precio:</h5> {purchase.price} {purchase.currency} </div>
            <div><h5>Total:</h5> {purchase.price * purchase.purchaseQuantity} {purchase.currency} </div>
            {children}
        </li>
    )
} 
import { ReactNode } from "react";
import { pendingItem } from "../models";
import { capitalize, TokenStorage } from "../../../shared/services";
import "./styles/pending-item.scss";

interface Props {
    pendingItem: pendingItem;
    children: ReactNode;
}

export const PendingItem = ({ pendingItem, children }: Props) => {
    const usertoken = TokenStorage.getToken();  
    const userInfo = usertoken ? TokenStorage.decodeToken(usertoken) : undefined;

    return (
        <li className="pending-item">
            <div className="item">
                <h3>{capitalize(pendingItem.name)} 
                    {pendingItem.brand  &&
                    pendingItem.brand !== "Sin Especificar" && 
                    ` (${capitalize(pendingItem.brand)})`}
                </h3>
                <span className="item-stat">
                    <h4>Precio: </h4>
                    {pendingItem.price} {userInfo?.currency} por {pendingItem.quantity} {pendingItem.unit}
                </span>
            </div>
            {children}
        </li>
    )
}
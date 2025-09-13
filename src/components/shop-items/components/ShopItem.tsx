import { ReactNode } from "react";
import { shopItem } from "../models";
import { capitalize } from "../../../shared/services";

import "./styles/shop-item.scss";

interface Props {
    shopItem: shopItem;
    children: ReactNode;
}

export const ShopItem = ({ shopItem, children }: Props) => {
    return (
        <li className="shop-item">
            <div className="item">
                <h3>{capitalize(shopItem.name)} 
                    {shopItem.brand  &&
                    shopItem.brand !== "Sin Especificar" && 
                    ` (${capitalize(shopItem.brand)})`}
                </h3>
                <span className="item-stat">
                    <h4>Precio: </h4>
                    {shopItem.price} {shopItem.currency} por {shopItem.quantity} {shopItem.unit}
                </span>
            </div>
            {children}
        </li>
    )
}
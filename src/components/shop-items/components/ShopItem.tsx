import { ReactNode } from "react";
import { shopItem } from "../models";
import { capitalize, TokenStorage } from "../../../shared/services";

import "./styles/shop-item.scss";

interface Props {
    shopItem: shopItem;
    children: ReactNode;
}

export const ShopItem = ({ shopItem, children }: Props) => {
    const usertoken = TokenStorage.getToken();  
    const userInfo = usertoken ? TokenStorage.decodeToken(usertoken) : undefined;

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
                    {shopItem.price} {userInfo?.currency} por {shopItem.quantity} {shopItem.unit}
                </span>
            </div>
            {children}
        </li>
    )
}
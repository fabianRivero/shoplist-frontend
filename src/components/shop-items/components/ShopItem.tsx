import { ReactNode } from "react";
import { shopItem } from "../models";

interface Props {
    shopItem: shopItem;
    children: ReactNode;
}

export const ShopItem = ({ shopItem, children }: Props) => {
    return (
        <li>
            {shopItem.name}
            {children}
        </li>
    )
}
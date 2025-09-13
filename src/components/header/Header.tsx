import { ReactNode } from "react";
import { LinkList } from "./LinkList";
import { BurgerMenu } from "./BurgerMenu";
import "./header.scss"

interface Props {
    children: ReactNode;
}

export const Header = ({ children }: Props) => {

    return(
        <>
            <header>
                <div>LOGO</div>

                <BurgerMenu/>

                <LinkList cls="headerList"/>

            </header>
            {children}
        </>
    )
}
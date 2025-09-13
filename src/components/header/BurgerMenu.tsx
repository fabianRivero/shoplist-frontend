import { useState } from "react";
import { LinkList } from "./LinkList";

export const BurgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [blurScreenClass, setBlurScreenClass] = useState("closed");

    const toggleMenu = () => {
        setIsOpen(!isOpen)
        setBlurScreenClass(isOpen ? "closed" : "open")
    }

    const closeMenu = () => {
        setIsOpen(false)
        setBlurScreenClass("closed")
    }

    return(
        <>
        <div className="burgerButton" onClick={toggleMenu}>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
        </div>

        <div className={isOpen ? "burgerMenuOpen" : "burgerMenuClosed"}>
            <div className="burgerButton" onClick={toggleMenu}>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
            </div>

            <LinkList cls="burgerList" isFromMenu={true} onLinkClick={closeMenu} />
        </div>

        <div className={blurScreenClass} onClick={closeMenu}></div>

        </>
    )
}


    
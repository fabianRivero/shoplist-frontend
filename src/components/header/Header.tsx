import { ReactNode, useContext } from "react";
import { LinkList } from "./LinkList";
import { BurgerMenu } from "./BurgerMenu";
import "./header.scss"
import { ProfileMenuContainer } from "../profile-menu/ProfileMenuContainer";
import { HeaderModal } from "../../shared/components/headerModal/HeaderModal";
import { HeaderModalContext } from "../../shared/components/headerModal/context";
import { useNavigate } from "react-router-dom";

interface Props {
    children: ReactNode;
}

export const Header = ({ children }: Props) => {
    const { setState: setModalState } = useContext(HeaderModalContext);
    const navigate = useNavigate();

    const profileButton = () => {
        setModalState(true)
    }

    const handleButtonclick = () => {
        navigate("/main-menu")
    }
 
    return(
        <>
            <header>
                <button className="logo-container" onClick={() => handleButtonclick()}><img src="./logo.png" alt="buySmart" className="logo"/></button>
                <div className="header-options">
                    <button className="profile-button" onClick={profileButton}>Perfil</button>

                    <BurgerMenu/>

                    <LinkList cls="headerList"/>
                </div>            
            </header>
            {children}

            <HeaderModal>
                <ProfileMenuContainer />
            </HeaderModal>
        </>
    )
}
import { ReactNode, useState } from "react";
import { ModalContext, ModalData } from "./" 

interface ModalState {
    open: boolean,
    data?: ModalData,
} 

export const ModalProvider = ({ children }: { children:  ReactNode}) => {
    const [state, setState] = useState<ModalState>({
    open: false,
    });

    return(
        
        <ModalContext.Provider value={{ state, setState }}>{children}</ModalContext.Provider>
    )
}


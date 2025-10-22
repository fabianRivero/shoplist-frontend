import { ReactNode, useState } from "react";
import { HeaderModalContext } from "." 

export const HeaderModalProvider = ({ children }: { children:  ReactNode}) => {
    const [state, setState] = useState<boolean>(false);

    return(
        
        <HeaderModalContext.Provider value={{ state, setState }}>{children}</HeaderModalContext.Provider>
    )
}


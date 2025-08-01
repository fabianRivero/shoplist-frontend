import { createContext } from "react";

export const ModalContext = createContext<{
    state: boolean;
    setState: React.Dispatch<React.SetStateAction<boolean>>
}>({
    state: false,
    setState: () => null
})

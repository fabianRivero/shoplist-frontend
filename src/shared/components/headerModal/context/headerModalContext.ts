import React, { createContext } from "react";

export type HeaderModalState = boolean;

export const HeaderModalContext = createContext<{
  state: HeaderModalState;
  setState: React.Dispatch<React.SetStateAction<boolean>>
}>({
    state: false,
    setState: () => null
})

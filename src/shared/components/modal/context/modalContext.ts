import { createContext } from "react";

export type ModalData = {
  id?: string;
  date?: string;
  mode: "create" | "edit";
  form: "purchase" | "shopItem" | "analyzeItem";
};

export type ModalState = {
  open: boolean;
  data?: ModalData;
};

export const ModalContext = createContext<{
  state: ModalState;
  setState: (value: ModalState) => void;
}>({
    state: { open: false },
    setState: () => undefined
})

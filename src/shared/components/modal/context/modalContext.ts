import { createContext } from "react";

export type ModalData = {
  id?: string;
  date?: string;
  mode: "create" | "edit";
  form: "purchase" | "shopItem";
};


export const ModalContext = createContext<{
  state: { open: boolean; data?: ModalData };
  setState: (value: { open: boolean; data?: ModalData }) => void;
}>({
    state: { open: false },
    setState: () => {}
})

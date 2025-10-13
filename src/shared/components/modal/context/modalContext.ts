import { createContext } from "react";
import { register } from "../../../../components/analyzer/models/analyzerModel";

export type ModalData = {
  id?: string;
  date?: string;
  dataToUse?: register;
  mode: "create" | "edit" | "view";
  content: "purchase" | "shopItem" | "analyzeItem" | "itemDetails";
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

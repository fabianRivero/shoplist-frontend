import { createContext } from "react";
import { SummaryAction, SummaryState } from "../models/summaryState";

export const initialState: SummaryState = {
    summary: null
}

export const SummaryContext = createContext<{
    state: SummaryState;
    dispatch: React.Dispatch<SummaryAction>;
}>({
    state: initialState,
    dispatch: () => null,
});
import React, { createContext } from "react";
import { AnalyzerAction, AnalyzerState } from "../models/AnalizerState";

const initialState: AnalyzerState = {
    items: []
}

export const AnalyzerContext =createContext<{
    state: AnalyzerState;
    dispatch: React.Dispatch<AnalyzerAction>
}>({
    state: initialState,
    dispatch: () => null
})
import { useReducer } from "react";
import { AnalyzerAction, AnalyzerActionType, AnalyzerState } from "../models/AnalizerState";
import { AnalyzerContext } from "./analyzerContext";

const initialState: AnalyzerState = {
    items: []
}

const AnalyzerReducer = (state: AnalyzerState, action: AnalyzerAction): AnalyzerState => {
    switch (action.type) {

        case AnalyzerActionType.ADD: {
            return{
                ...state,
                items: [...state.items, action.payload]
            }
        }

        case AnalyzerActionType.DELETE: {
            return {
                ...state,
                items: state.items.filter(i => i.register.startDate !== action.payload.register.startDate),
            };
        }

        case AnalyzerActionType.CLEAR_ALL: {
            return initialState;
        }

        default:
            return state;
    }
};

export const AnalyzerProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(AnalyzerReducer, initialState)

    return(
        <AnalyzerContext.Provider value={{ state, dispatch }}>{children}</AnalyzerContext.Provider>
    )
}
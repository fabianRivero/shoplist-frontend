import { register } from "./analyzerModel";

export enum AnalyzerActionType {
    ADD = "ADD",
    DELETE = "DELETE",
    CLEAR_ALL = "CLEAR_ALL",
    CHANGE_PERIOD = "CHANGE_PERIOD"
}

export interface AnalyzerState {
    items: register[],
    period: string
}

export type AnalyzerAction = 
| {type: AnalyzerActionType.ADD, payload: register}
| {type: AnalyzerActionType.DELETE, payload: register}
| {type: AnalyzerActionType.CLEAR_ALL, payload: AnalyzerState}
| {type: AnalyzerActionType.CHANGE_PERIOD, payload: string}
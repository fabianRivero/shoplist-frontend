import { register } from "./analyzerModel";

export enum AnalyzerActionType {
    ADD = "ADD",
    DELETE = "DELETE",
    CLEAR_ALL = "CLEAR_ALL"
}

export interface AnalyzerState {
    items: register[]
}

export type AnalyzerAction = 
| {type: AnalyzerActionType.ADD, payload: register}
| {type: AnalyzerActionType.DELETE, payload: register}
| {type: AnalyzerActionType.CLEAR_ALL, payload: AnalyzerState}
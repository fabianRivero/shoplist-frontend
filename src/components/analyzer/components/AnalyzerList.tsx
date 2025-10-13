import { AnalyzerContext } from "../context/analyzerContext";
import { useContext } from "react";
import { AnalyzerActionType } from "../models/AnalizerState";
import { AnalyzerItem } from "./AnalyzerItem";
import { ModalContext } from "../../../shared/components/modal/context";
import "./styles/analyzer-list.scss"
import { register } from "../models/analyzerModel";

export const AnalyzerList = () => {
    const { state, dispatch } = useContext(AnalyzerContext);
    const { setState: modalSetState } = useContext(ModalContext) 
   
    function handleRemoveItem(date: string) {
        const itemToDelete = state.items.filter((item) => {
            return item.register.startDate === date  
        })

        dispatch({
            type: AnalyzerActionType.DELETE,
            payload: itemToDelete[0]
        })
    }

    function openModal(item: register){
        modalSetState({
        open: true,
        data: { mode: "view", content: "itemDetails", dataToUse: item },
        });
    }

    return(
        <ul className="analyzer-list">{
            state.items.map((item) => {
                return(
                    <AnalyzerItem key={item.register.startDate} item={item} period={state.period}>
                        <div className="buttons">
                            <button onClick={() => openModal(item)}>detalles</button>
                            <button onClick={() => handleRemoveItem(item.register.startDate)}>Eliminar item</button>
                        </div>
                    </AnalyzerItem>

                )
            })
        }
        </ul>
    )
}
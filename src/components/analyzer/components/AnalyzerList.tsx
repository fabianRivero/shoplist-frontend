import { AnalyzerContext } from "../context/analyzerContext";
import { register } from "../models/analyzerModel";
import { useContext } from "react";
import { AnalyzerActionType } from "../models/AnalizerState";
import { AnalyzerItem } from "./AnalyzerItem";
import "./styles/analyzer-list.scss"

interface items {
    items: register[]
}

export const AnalyzerList = ( items: items ) => {
    const { state, dispatch } = useContext(AnalyzerContext);
   
    function handleRemoveItem(date: string) {
        const itemToDelete = state.items.filter((item) => {
            return item.register.startDate === date  
        })

        dispatch({
            type: AnalyzerActionType.DELETE,
            payload: itemToDelete[0]
        })
    }

    return(
        <>            
            <ul className="analyzer-list">{
                items.items.map((item) => {
                    return(
                    <AnalyzerItem key={item.register.startDate} item={item}>
                        <div className="buttons">
                            <button>detalles</button>
                            <button onClick={() => handleRemoveItem(item.register.startDate)}>Eliminar item</button>
                        </div>
                    </AnalyzerItem>
                    )

                })
            }</ul>
        </>
    )
}
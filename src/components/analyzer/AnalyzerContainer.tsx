import { useContext, useState } from "react"
import { AnalyzerContext } from "./context/analyzerContext"
import { AnalyzerList } from "./components/AnalyzerList"
import { AnalyzerActionType, AnalyzerState } from "./models/AnalizerState"
import { Modal } from "../../shared/components/modal/Modal"
import { ModalContext } from "../../shared/components/modal/context"
import { AddItemForm } from "./components/AddItemForm"
import "./analyzer-container.scss"
import { ComparisonTable } from "./components/Comparison-table"

const initialState: AnalyzerState = {
    items: []
}

export const AnalyzerContainer = () => {
    const { state, dispatch } = useContext(AnalyzerContext)
    const [type, setType] = useState<string>("month")
    const { state: modalState, setState: modalSetState } = useContext(ModalContext) 

    function clearAllItems() {
        dispatch({
            type: AnalyzerActionType.CLEAR_ALL,
            payload: initialState
        })  
    }

    function changeAnalyzerPeriod(type: string) {
        clearAllItems()
        setType(type)
    }

    const openModal = () => {
        modalSetState({
        open: true,
        data: { mode: "create", form: "analyzeItem" },
        });
    };

    return (
        <main className="analyzer-container">
                <div className="analyzer-container-header">
                    <h2>Análisis de compras</h2>
                    <label>
                        <select 
                            name="period" 
                            id="period-select" 
                            value={type} 
                            onChange={(e) => changeAnalyzerPeriod(e.target.value)}>
                                <option value="month">Mes</option>
                                <option value="year">Año</option>
                        </select>
                    </label>
                    
                </div>

                <div className="content">
                    <div className="analisis-section">
                    <div className="items-list-header">
                        <h3>Items seleccionados</h3>
                        <button onClick={() => openModal()}>
                            Agregar {`${type === "month" ? "mes" : "año"}`}
                        </button>
                    </div>
                    {state && state.items.length > 0 ?
                        
                        <AnalyzerList items={state.items}/>                        
                        
                    :
                        <p className="not-found-message">No hay items seleccionados</p>
                    }
                    </div>
                
                <ComparisonTable />
                </div>

            <Modal>
            {modalState.data?.form === "analyzeItem" && <AddItemForm period={type}/>}
            </Modal>
        </main>
    )
}
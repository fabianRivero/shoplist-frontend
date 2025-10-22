import { useContext } from "react"
import { AnalyzerContext } from "./context/analyzerContext"
import { AnalyzerList } from "./components/AnalyzerList"
import { AnalyzerActionType, AnalyzerState } from "./models/AnalizerState"
import { Modal } from "../../shared/components/modal/Modal"
import { ModalContext } from "../../shared/components/modal/context"
import { AddItemForm } from "./components/AddItemForm"
import { ComparisonTable } from "./components/ComparisonTable"
import { BarChart } from "./components/BarChart"
import { ItemDetails } from "./components/ItemDetails"
import { register } from "./models/analyzerModel"
import "./analyzer-container.scss"

const initialState: AnalyzerState = {
    items: [],
    period: "month"
}

export const AnalyzerContainer = () => {
    const { state, dispatch } = useContext(AnalyzerContext)
    const { state: modalState, setState: modalSetState } = useContext(ModalContext) 

    function changeAnalyzerPeriod(value: string) {
    dispatch({
        type: AnalyzerActionType.CLEAR_ALL,
        payload: initialState
    })

    dispatch({
        type: AnalyzerActionType.CHANGE_PERIOD,
        payload: value
    })
    }

    const openModal = () => {
        modalSetState({
        open: true,
        data: { mode: "create", content: "analyzeItem" },
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
                            value={state.period} 
                            onChange={(e) => changeAnalyzerPeriod(e.target.value)}>
                                <option value="month">Mes</option>
                                <option value="year">Año</option>
                        </select>
                    </label>
                    
                </div>

                <div className="content">
                    <div className="left-section">
                        <div className="analisis-section">
                            <div className="items-list-header">
                                <h3>Items seleccionados</h3>
                                <button onClick={() => openModal()}>
                                    Agregar {`${state.period === "month" ? "mes" : "año"}`}
                                </button>
                            </div>
                            <div className="analyzer-list-container">
                                {state && state.items.length > 0 ?
                                    <AnalyzerList />                        
                                :
                                    <p className="not-found-message">No hay items seleccionados</p>
                                }
                            </div>
                        </div>

                        <div className="chart comparison-table-container">
                            <h3>{state.period === "year" ? `Tabla de gastos` : `Tabla de gastos y presupuestos`}</h3>
                            <ComparisonTable />
                        </div>
                    </div>


                    {state && state.items.length > 0 && 
                        <div className="chart bar-chart-container">
                            <h3>{state.period === "year" ? `Gráfica de gastos` : `Gráfica de gastos y presupuestos`}</h3>
                            <BarChart />    
                        </div>
                    }
 
                </div>

            <Modal>
                {modalState.data?.content === "analyzeItem" && <AddItemForm />}
                {modalState.data?.content === "itemDetails" && modalState.data?.dataToUse && 
                <ItemDetails item={modalState.data.dataToUse as register}/>}
            </Modal>
        </main>
    )
}
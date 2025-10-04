import { useContext, useMemo } from "react"
import { AnalyzerContext } from "../context/analyzerContext"
import { register } from "../models/analyzerModel"
import { getMonthName } from "../../../shared/services"
import "./styles/comparison-table.scss"
   
export const ComparisonTable = () => {
    const { state } = useContext(AnalyzerContext)

    const sectors = useMemo(() => {
        const sectorSet = new Set<string | undefined>()

        state.items.forEach(item => {
            item.register.logs.forEach(log => {
                log.purchases.forEach(purchase => {
                sectorSet.add(purchase.sector)
                })
            })
        })
        return Array.from(sectorSet)
    }, [state.items])

    const formattedDate = (data: string) => {
        const month = getMonthName({num: Number(data.slice(5, 7))})

        const year = data.slice(0, 4)

        const date = `${month.slice(0, 3)}/${year}`

        return date
    }


    const itemDates = useMemo(() => {
        const dateSet = new Set<string | undefined>()

        state.items.forEach(item => {
            dateSet.add(item.register.startDate)

        })
        return Array.from(dateSet)
    }, [state.items])

    const getSectorValue = (sector: string | undefined, item: register) => {
        let count = 0
        item.register.logs.forEach(log => {
        log.purchases.forEach(purchase => {
            if (purchase.sector === sector) {
            count += (purchase.purchaseQuantity * purchase.price)
            }
        })
        })
        return count
    }

    if (state.items.length === 0) {
        return <p className="not-found-message">No hay items seleccionados</p>
    }

    return(
        <>
            <table className="comparison-table">
                <thead className="dates">
                    <tr>
                        <th>Sector</th>
                        {
                        itemDates.map((date) => (
                                <>
                                    <th key={date} scope="col">{formattedDate(String(date))}</th>
                                </>
                            ))
                        }
                    </tr>
                </thead>

                <tbody className="table-body">
                    {
                        sectors.map((sector) => (
                            <tr key={sector}>
                                <th scope="row" key={sector}>{sector}</th>
                                <>
                                {
                                    state.items.map((item) => {
                                        const total = getSectorValue(sector, item)

                                        return(
                                            <td key={`${sector}-${item.register.startDate}`}>
                                            {total} $
                                            </td>
                                        )
                                        
                                    })
                                }
                                </>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </>
    )
}   
   
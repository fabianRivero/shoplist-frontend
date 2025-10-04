import { ReactNode, useContext } from "react"
import { AuthContext } from "../auth/context"
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthContainer } from "../auth/AuthContainer";
import { MainMenu } from "../components/MainMenu";
import { ShopItemProvider } from "../components/shop-items/context/shopItem";
import { ShopItemsContainer } from "../components/shop-items";
import { PurchaseProvider } from "../components/shop-list/context/ShopListReducer";
import { SummaryProvider } from "../components/summary/context/SummaryReducer";
import { BudgetPlanningContainer } from "../components/summary/components/budgetPlanning/BudgetPlanningContainer";
import { Header } from "../components/header/Header";
import { PurchaseManagerContainer } from "../components/purchase-manager/PurchaseManagerContainer";
import { AnalyzerProvider } from "../components/analyzer/context/AnalyzerReducer";
import { AnalyzerContainer } from "../components/analyzer/AnalyzerContainer";

const PrivateRoute = ({ children }: { children: ReactNode}) => {
    const { state } = useContext(AuthContext);
    if (state.loading) {
      return <div>Cargando...</div>; 
    }

    return state.isAuthenticated ? children : <Navigate to="/" />;
}

export const AppRouter = () => (
  <Routes>
    <Route path="/*" element={<AuthContainer />} />
    <Route path="/main-menu" element={<PrivateRoute><Header><SummaryProvider><PurchaseProvider><MainMenu/></PurchaseProvider></SummaryProvider></Header></PrivateRoute>} />
    <Route path="/budget-planning" element={<PrivateRoute><Header><SummaryProvider><BudgetPlanningContainer/></SummaryProvider></Header></PrivateRoute>}/>
    <Route path="/item-list" element={<PrivateRoute><Header><ShopItemProvider><ShopItemsContainer /></ShopItemProvider></Header></PrivateRoute>}/>
    <Route path="/purchase-manager" element={<PrivateRoute><Header><PurchaseProvider><PurchaseManagerContainer/></PurchaseProvider></Header></PrivateRoute>}/>
    <Route path="/analyzer" element={<PrivateRoute><Header><AnalyzerProvider><AnalyzerContainer/></AnalyzerProvider></Header></PrivateRoute>}/>
  </Routes>
)
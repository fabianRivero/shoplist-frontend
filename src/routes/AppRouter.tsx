import { ReactNode, useContext } from "react"
import { AuthContext } from "../auth/context"
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthContainer } from "../auth/AuthContainer";
import { MainMenu } from "../components/MainMenu";
import { ShopItemProvider } from "../components/shop-items/context/shopItem";
import { ShopItemsContainer } from "../components/shop-items";
import { ShopItemForm } from "../components/shop-items/components/ShopItemForm";
import { PurchaseForm } from "../components/shop-list/components/PurchaseForm";
import { PurchaseProvider } from "../components/shop-list/context/ShopListReducer";
import { SummaryProvider } from "../components/summary/context/SummaryReducer";
import { BudgetPlanningContainer } from "../components/summary/components/budgetPlanning/BudgetPlanningContainer";
import { Header } from "../components/header/Header";

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
    <Route path="/item-list" element={<PrivateRoute><Header><ShopItemProvider><ShopItemsContainer/></ShopItemProvider></Header></PrivateRoute>}/>
    <Route path="/edit-item/:id" element={<PrivateRoute><Header><ShopItemProvider><ShopItemForm/></ShopItemProvider></Header></PrivateRoute>}/>
    <Route path="/add-purchase/:date/:id" element={<PrivateRoute><Header><ShopItemProvider><PurchaseForm mode="create"/></ShopItemProvider></Header></PrivateRoute>}/>
    <Route path="/edit-purchase/:date/:id" element={<PrivateRoute><Header><PurchaseProvider><PurchaseForm mode="edit"/></PurchaseProvider></Header></PrivateRoute>}/>
  </Routes>
)
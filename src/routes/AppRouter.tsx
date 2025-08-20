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
    <Route path="/main-menu" element={<PrivateRoute><PurchaseProvider><MainMenu/></PurchaseProvider></PrivateRoute>} />
    <Route path="/item-list" element={<PrivateRoute><ShopItemProvider><ShopItemsContainer/></ShopItemProvider></PrivateRoute>}/>
    <Route path="/edit-item/:id" element={<PrivateRoute><ShopItemProvider><ShopItemForm/></ShopItemProvider></PrivateRoute>}/>
    <Route path="/add-purchase/:date/:id" element={<PrivateRoute><ShopItemProvider><PurchaseForm mode="create"/></ShopItemProvider></PrivateRoute>}/>
    <Route path="/edit-purchase/:date/:id" element={<PrivateRoute><PurchaseProvider><PurchaseForm mode="edit"/></PurchaseProvider></PrivateRoute>}/>
  </Routes>
)
import { ReactNode, useContext } from "react"
import { AuthContext } from "../auth/context"
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthContainer } from "../auth/AuthContainer";
import { MainMenu } from "../components/MainMenu";
import { ShopItemProvider } from "../components/shop-items/context/shopItem";
import { ShopItemsContainer } from "../components/shop-items";
import { ShopItemForm } from "../components/shop-items/components/ShopItemForm";

const PrivateRoute = ({ children }: { children: ReactNode}) => {
    const { state } = useContext(AuthContext);

    return state.isAuthenticated ? children : <Navigate to="/" />;
}

export const AppRouter = () => (
  <Routes>
    <Route path="/*" element={<AuthContainer />} />
    <Route path="/main-menu" element={<PrivateRoute><MainMenu/></PrivateRoute>} />
    <Route path="/item-list" element={<PrivateRoute><ShopItemProvider><ShopItemsContainer/></ShopItemProvider></PrivateRoute>}/>
    <Route path="/edit-item/:id" element={<PrivateRoute><ShopItemProvider><ShopItemForm/></ShopItemProvider></PrivateRoute>}/>
  </Routes>
)
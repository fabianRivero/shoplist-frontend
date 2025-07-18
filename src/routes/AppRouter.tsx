import { ReactNode, useContext } from "react"
import { AuthContext } from "../auth/context"
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthContainer } from "../auth/AuthContainer";
import { MainMenu } from "../main-menu";

const PrivateRoute = ({ children }: { children: ReactNode}) => {
    const { state } = useContext(AuthContext);

    return state.isAuthenticated ? children : <Navigate to="/" />;
}

export const AppRouter = () => (
  <Routes>
    <Route path="/*" element={<AuthContainer />} />
    <Route path="/main-menu" element={<PrivateRoute><MainMenu /></PrivateRoute>} />
  </Routes>
)
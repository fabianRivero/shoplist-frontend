import { useContext } from "react";
import { AuthContext } from "./context";
import { Navigate, Route, Routes } from "react-router-dom";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";

export const AuthContainer = () => {
    const { state } = useContext(AuthContext);

    if(state.isAuthenticated) {
        return <Navigate to="/main-menu" />;
    }

    return(
        <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
        </Routes>
    );
}
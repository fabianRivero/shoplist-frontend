import { Route, Routes } from "react-router-dom";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { NotFound } from "./NotFound";

export const AuthContainer = () => {
    
    return(
        <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
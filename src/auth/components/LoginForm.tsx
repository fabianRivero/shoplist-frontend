import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useContext, useState } from "react";
import { AuthContext } from "../context";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../services/AuthService";
import { AuthActionType } from "../models";
import { FormInput } from "../../shared/components";
import "./styles/auth-form.scss";

const loginSchema = z.object({
    email: z.string().email("email inválido"),
    password: z.string().min(8, "la contraseña debe tener al menos 8 caracteres")
})

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
    const { register, handleSubmit, formState } = useForm<LoginFormData>(
        { resolver: zodResolver(loginSchema) }
    )
    const [loading, setLoading] = useState(false);
    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = async (data: LoginFormData) => {
        try{
            setLoading(true)
            const authService = new AuthService();
            const user = await authService.login(data.email, data.password);
            dispatch({ type: AuthActionType.LOGIN, payload: user });
            navigate("/main-menu");
            setLoading(false)
        }catch (error){
            if(error instanceof Error){
                alert(error.message || "Error al iniciar sesión");
                setLoading(false)
            } 
        }finally{
            setLoading(false)
        }
    }

    return(
        <div className="auth-container">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                <FormInput label="Email" register={register("email")} error = {formState.errors.email?.message} />
                <FormInput label="Contraseña" register={register("password")} error = {formState.errors.password?.message} type="password" />
                <button type="submit" disabled={loading}>
                    {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </button>
            </form>

            <p>¿No tienes cuenta? <Link to="/register"><span className="change">Regístrate</span></Link></p>
        </div>
    )
}
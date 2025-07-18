import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useContext } from "react";
import { AuthContext } from "../context";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../services/AuthService";
import { AuthActionType } from "../models";
import { FormInput } from "../../shared/components";

const loginSchema = z.object({
    email: z.string().email("email inválido"),
    password: z.string().min(8, "la contraseña debe tener al menos 8 caracteres")
})

type LoginFormData = z.infer<typeof loginSchema>;


export const LoginForm = () => {
    const { register, handleSubmit, formState } = useForm<LoginFormData>(
        { resolver: zodResolver(loginSchema) }
    )

    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = async (data: LoginFormData) => {
        try{
            const authService = new AuthService();
            const user = await authService.login(data.email, data.password);
            dispatch({ type: AuthActionType.LOGIN, payload: user });
            navigate("/main-menu");
        }catch (error){
            if(error instanceof Error){
                alert(error.message || "Error al iniciar sesión");
            }
        }
        
    }

    return(
        <div className="container">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="form">
                <FormInput label="Email" register={register("email")} error = {formState.errors.email?.message} />
                <FormInput label="Password" register={register("password")} error = {formState.errors.password?.message} type="password" />
                <button type="submit">Iniciar Sesión</button>
            </form>

            <p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
        </div>
    )
}
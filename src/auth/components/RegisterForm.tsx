import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import z from "zod";
import { AuthService } from "../services/AuthService";
import { FormInput } from "../../shared/components";
import { useForm } from "react-hook-form";
import "./styles/auth-form.scss";

const registerSchema = z.object({
    email: z.string().email("email inválido"),
    username: z.string().min(3, "el nombre de usuario debe tener al menos 3 caracteres"),
    password: z.string().min(8, "la contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(8, "Mínimo 8 caracteres")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
    const { register, handleSubmit, formState } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema)
    })

    const navigate = useNavigate();

    const onSubmit = async(data: RegisterFormData) => {
        try{
            const authService = new AuthService();
            await authService.register(data.email, data.password, data.username);
            alert("Registro Existoso");
            navigate("/");
        } catch (error) {
            console.error("Error durante el registro:", error);
            alert("Error durante el registro");
        }
    }

    return (
        <div className="auth-container">
            <h2>Regístrate</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                <FormInput label="Email" register={register("email")} error={formState.errors.email?.message} />
                <FormInput label="Nombre de usuario" register={register("username")} error={formState.errors.username?.message} />
                <FormInput label="Contraseña" register={register("password")} error={formState.errors.password?.message} type="password" />
                <FormInput label="Confirmar contraseña" register={register("confirmPassword")} error={formState.errors.confirmPassword?.message} type="password" />
                <button type="submit">Registrarse</button>
            </form>
            <p>¿Ya tienes una cuenta? <Link to={"/"}><span className="change">Inicia sesión</span></Link></p>
        </div>
    );
}
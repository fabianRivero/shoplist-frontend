import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

/*primero hacemos el esquema del login con zod*/

const loginSchema = z.object({
    email: z.string().email("email inválido"),
    password: z.string().min(8, "la contraseña debe tener al menos 8 caracteres")
})

//inferimos el tipado con z.infer
type LoginFormData = z.infer<typeof loginSchema>;


const Login = () => {
    //usamos useForm de react-hook-form con el esquema de zod
    const { register, handleSubmit, formState } = useForm<LoginFormData>(
        { resolver: zodResolver(loginSchema) }
    )
}
export default Login;
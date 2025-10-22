import { useContext } from "react";
import { AuthContext } from "../../auth/context";
import { AuthActionType, User } from "../../auth/models";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../auth/services";
import { FormInput } from "../../shared/components";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "./initial-setup-container.scss";

const initialSetupSchema = z.object({
    currency: z.string().min(3, "La divisa debe tener por lo menos 3 caracteres"),
})

type InitialSetupData = z.infer<typeof initialSetupSchema>;

export const InitialSetupContainer = () => {
  const { state, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const { register, handleSubmit, formState } = useForm<InitialSetupData>(
      { resolver: zodResolver(initialSetupSchema) }
  )

  const onSubmit = async (data: InitialSetupData) => {
    const updatedUser: User = {
      ...(state.user as User),
      currency: data.currency,
      isConfigured: true,
    };

    try{
      const authService = new AuthService();
      await authService.setInitialSetup(data.currency);
      dispatch({ type: AuthActionType.LOGIN, payload: updatedUser });
      navigate("/main-menu");
    }catch (error){
      if(error instanceof Error){
          alert(error.message || "Error al eligir divisa");
      }
    }
  }

  return (
    <>
        {state && 
          <main className="setup-container">
            <h2>Establece la divisa que quieres usar</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="currency-form">
              <FormInput label="Divisa" register={register("currency")} error={formState.errors.currency?.message} />
              <button type="submit">Guardar y continuar</button>
            </form>    
          </main>
        }
    </>
  );
};

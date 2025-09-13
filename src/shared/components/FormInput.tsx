import { UseFormRegisterReturn } from "react-hook-form";
import "./form-input.scss";

type Props = {
    label: string;
    register: UseFormRegisterReturn;
    type?: string;
    error?: string;
    readOnly?: boolean;
    disabled?: boolean;
}

export const FormInput = ({ label, register, error, type= "text" }: Props) => (
    <div className="form-input">
        <label>{label}</label>
        <input 
        type={type} 
        step={type==="number" ? "any" : undefined}
        inputMode={type === "number" ? "decimal" : undefined}
        {...register} />
        {error && <span className="error-message">{error}</span>}
    </div>
)
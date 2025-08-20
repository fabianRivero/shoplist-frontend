import { UseFormRegisterReturn } from "react-hook-form";

type Props = {
    label: string;
    register: UseFormRegisterReturn;
    type?: string;
    error?: string;
    readOnly?: boolean;
    disabled?: boolean;
}

export const FormInput = ({ label, register, error, type= "text" }: Props) =>(
    <div className="formgroup">
        <label>{label}</label>
        <input 
        type={type} 
        step={type==="number" ? "0.01" : undefined}
        {...register} />
        {error && <span className="error">{error}</span>}
    </div>
)
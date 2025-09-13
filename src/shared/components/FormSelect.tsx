import { useState } from "react";
import { UseFormRegister, Path, FieldValues } from "react-hook-form";

type Option = {
  value: string | number;
  label: string;
};

type Props<TFormValues extends FieldValues> = {
  label: string;
  name: Path<TFormValues>; 
  register: UseFormRegister<TFormValues>;
  options: Option[];
  error?: string;
  allowCustom?: boolean; 
  setValueAs?: (value: string | number) => string | number;
};

export function FormSelect<TFormValues extends FieldValues>({ label, name, register, options, error, allowCustom = false, setValueAs }: Props<TFormValues>) {
  const [isCustom, setIsCustom] = useState(false);

  return (
    <div className="form-input">
      <label>{label}</label>

      {!isCustom ? (
        <select
          {...register(name, {
            setValueAs,
          })}
          onChange={(e) => {
            if (allowCustom && e.target.value === "Otro") setIsCustom(true);
          }}
          defaultValue=""
        >
          <option value="" disabled>Selecciona {label.toLowerCase()}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
          {allowCustom && <option value="Otro">Otro</option>}
        </select>
      ) : (
        <input
          type="text"
          {...register(name, {
            setValueAs: setValueAs || ((v) => v),
          })}
          placeholder={`Escribe un nuevo ${label.toLowerCase()}`}
        />
      )}

      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

import CreatableSelect from "react-select/creatable";
import { Controller } from "react-hook-form";

export const CreateSelect = ({ options, control, formState }) => (
    <>
        <Controller
            control={control}
            name="sector"
            render={({ field }) => (
                <CreatableSelect
                {...field}
                options={options}
                onChange={(option) => field.onChange(option?.value)}
                onCreateOption={(newValue) => field.onChange(newValue)}
                placeholder="Selecciona o crea un sector"
                />
            )}
        />

        {formState.errors.sector && <p>{formState.errors.sector.message}</p>}
    </>
)



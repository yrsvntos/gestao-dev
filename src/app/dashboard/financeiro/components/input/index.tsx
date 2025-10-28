import { RegisterOptions, UseFormRegister } from "react-hook-form";

export interface ContaInputProps{
    name: string;
    type: string;
    placeholder: string;
    register: UseFormRegister<any>;
    rules?: RegisterOptions;
    error?: string;


}

export default function InputConta({name, type, placeholder, register, rules, error}: ContaInputProps){
    return(
        <>
            <input 
                className="w-full max-w-full border-2 rounded-md h-11 p-4  border-gray-200"
                id={name}
                type={type}
                placeholder={placeholder}
                {...register(name, rules)}
            />

            {error && <p className="text-red-500">{error}</p>}
        </>
    );
}
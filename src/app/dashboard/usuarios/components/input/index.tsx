
import { RegisterOptions, UseFormRegister } from "react-hook-form"

interface InputProps{
    name: string,
    type: string,
    placeholder: string,
    register: UseFormRegister<any>
    error?: string,
    rules?: RegisterOptions;
}



export default function Input({name, type, placeholder, register, error, rules}: InputProps){
    return(
        <>
            <input 
                className="w-full max-w-full border-2 rounded-md h-11 p-4  border-gray-200"
                id={name}
                type={type}
                placeholder={placeholder}
                {...register(name, rules)}
            />
            {error && <p className="text-red-500 my-1">{error}</p>}
        </>
    )
}
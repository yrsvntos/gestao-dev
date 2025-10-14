
import { RegisterOptions, UseFormRegister } from "react-hook-form"

interface InputUserProps{
    name: string,
    type: string,
    placeholder: string,
    register: UseFormRegister<any>
    error?: string,
    rules?: RegisterOptions;
}



export default function InputUser({name, type, placeholder, register, error, rules}: InputUserProps){
    return(
        <>
            <input 
                className="w-full max-w-full border-2 rounded-md h-11 px-4 border-gray-200"
                id={name}
                type={type}
                placeholder={placeholder}
                {...register(name, rules)}
            />
            {error && <p className="text-red-500 my-1">{error}</p>}
        </>
    )
}

import { RegisterOptions, UseFormRegister } from "react-hook-form"

interface TextAreaProps{
    name: string,
    placeholder: string,
    register: UseFormRegister<any>
    error?: string,
    rules?: RegisterOptions;
}



export default function TextArea({name, placeholder, register, error, rules}: TextAreaProps){
    return(
        <>
            <textarea 
                className="w-full max-w-full border-2 rounded-md min-h-[100px] p-4 border-gray-200"
                id={name}
                placeholder={placeholder}
                {...register(name, rules)}
            />
            {error && <p className="text-red-500 my-1">{error}</p>}
        </>
    )
}
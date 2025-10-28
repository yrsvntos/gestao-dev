
import { RegisterOptions, UseFormRegister } from "react-hook-form"

export interface TextContaProps {
    name: string;
    placeholder: string;
    register: UseFormRegister<any>;
    error?: string;
    rules?: RegisterOptions;
}



export default function TextareaConta({name, placeholder, register, error, rules}: TextContaProps){
    return(
        <>
            <textarea 
                className="w-full max-w-full border-2 rounded-md h-41 p-4 border-gray-200"
                id={name}
                placeholder={placeholder}
                {...register(name, rules)}
            />
            {error && <p className="text-red-500 my-1">{error}</p>}
        </>
    )
}












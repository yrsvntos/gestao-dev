
import { RegisterOptions, UseFormRegister } from "react-hook-form"

export interface SelectContaProps {
    name: string;
    options: string[];
    register: UseFormRegister<any>;
    error?: string;
    rules?: RegisterOptions;
}



export default function SelectConta({name, options, register, error, rules}: SelectContaProps){
    return(
        <>
            <select 
                className="w-full max-w-full border-2 rounded-md h-11 px-4 border-gray-200"
                id={name}
                {...register(name, rules)}
                
            >
                <option value="" disabled>Selecione...</option>
                {options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
            {error && <p className="text-red-500 my-1">{error}</p>}
        </>
    )
}












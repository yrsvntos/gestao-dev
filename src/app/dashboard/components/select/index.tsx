
import { RegisterOptions, UseFormRegister } from "react-hook-form"

export interface SelectUserProps {
    name: string;
    options: string[]; // Aqui você passa ['Ativo', 'Inativo'] ou ['Masculino', 'Feminino']
    register: UseFormRegister<any>;
    error?: string;
    rules?: RegisterOptions;
}



export default function SelectUser({name, options, register, error, rules}: SelectUserProps){
    return(
        <>
            <select 
                className="w-full max-w-full border-2 rounded-md h-11 px-4 border-gray-200"
                id={name}
                {...register(name, rules)}
                
            >
                <option value="Selecione..." disabled>Selecione...</option>
                {options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
            {error && <p className="text-red-500 my-1">{error}</p>}
        </>
    )
}












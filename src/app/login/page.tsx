"use client";
import { useState } from "react";
import {auth} from "@/services/firebaseConnection"
import { signInWithEmailAndPassword } from "firebase/auth";
import { FiMail, FiLock } from "react-icons/fi";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const schema = z.object({
    email: z.string().email("Por favor insira um email válido.").nonempty("O campo de email é obrigatório"),
    password: z.string().min(6, "A password deve conter no mínimo 6 caracteres.").nonempty("O campo de password é obrigatório")
})

type FormData = z.infer<typeof schema>

export default function Login(){
    const [loading, setLoading] = useState(false);


    // Criar o formulário usando React Hook Form
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema), // <-- Aqui usamos o zodResolver
        mode: "onChange" // vai registar tudo sempre que o user modificar algo no input
    });
    const router = useRouter();
    async function handleLogin(data: FormData){
        setLoading(true); 
        try{
            await signInWithEmailAndPassword(auth, data.email, data.password );
            router.push("/dashboard");
            toast.success("Bem-vindo(a) ao sistema!")

        }catch(error:any){
            toast.error("E-mail ou Password inválidos!")
        }finally{
            setLoading(false); 
        }
        
    }


    return(
        <>
            <main className="flex flex-col items-center justify-center w-full min-h-screen">
                <h1 className="text-6xl font-extrabold">Gestão<span className="text-emerald-500">Dev</span></h1>
                <form
                    onSubmit={handleSubmit(handleLogin)}
                    className="w-full max-w-md p-4 bg-white border border-zinc-200 rounded-md mt-7"
                >
                    <div className="relative mb-4">
                        <FiMail size={20} className="absolute top-3 left-3 text-zinc-400"/>
                        <Input
                            placeholder="Insira o seu e-mail"
                            type="email"
                            name="email"
                            register={register}
                            error={errors?.email?.message}
                        />
                    </div>
                    <div className="relative mb-4">
                        <FiLock size={20} className="absolute top-3 left-3 text-zinc-400"/>
                        <Input
                            placeholder="Insira a sua password"
                            type="password"
                            name="password"
                            register={register}
                            error={errors?.password?.message}
                        
                        />
                    </div>
                    <button 
                        disabled={loading}
                        type="submit"
                        className="h-9 w-full bg-black rounded-md text-white font-bold cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"

                    >
                        {loading ? "Entrando..." : "Acessar"}
                    </button>
                </form>
            </main>
        </>
    )
}
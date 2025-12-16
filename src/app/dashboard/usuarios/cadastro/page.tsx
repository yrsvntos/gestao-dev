"use client"

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/services/firebaseConnection";
import { setDoc, doc } from "firebase/firestore";
import Link from "next/link";
import { schema, role, UserForm } from "@/components/schema/colaboradores";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { BsArrowLeft } from "react-icons/bs";
import Container from "@/components/container";
import Input from "../components/input";
import SelectUser from "../../colaboradores/components/select";
import { useState } from "react";




export default function Cadastro(){
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema), // <-- Aqui usamos o zodResolver
        mode: "onChange" // vai registar tudo sempre que o user modificar algo no input
    });
    function onSubmit(data: UserForm){
        
        const {name, email, password, role} = data;

        createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;

            // 👇 Define o nome do usuário no perfil do Firebase Auth
            await updateProfile(user, {
                displayName: name,
            });
  

            await setDoc(doc(db, "users", user.uid), {
                name: name,
                email: email,
                role: role,
                createdAt: new Date(),
            });

            toast.success("Usuário cadastrado com sucesso!");
            router.push("/dashboard/usuarios/")


        })
        .catch((error) => {
            console.log(error)
            toast.error("Erro ao cadastrar o usuário!")
        })
    }

    // if(loading){
    //     return(
    //         <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
    //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-600"></div>
    //           <p className="text-gray-600 font-medium">Carregando formulário...</p>
    //         </div>
    //     )
    // }


    return(
        <Container>
            
           <div className="flex items-center justify-between flex-wrap">
                    <h2 className="text-bold text-md">Cadastrar novo usuário.</h2>
                    <Link href="/dashboard/colaboradores" className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-500 text-white text-sm font-extrabold rounded-md px-4 py-2">
                        <BsArrowLeft size={18} color="#fff"/>
                        Voltar para colaboradores
                    </Link>
                </div>
                
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white p-5 rounded-md grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 gap-3 mt-8"
                >
                    <div className="my-4">
                        <label  className="font-bold">Nome</label>
                        <Input
                            placeholder="Digite o nome"
                            type="text"
                            name="name"
                            register={register}
                            error={errors?.name?.message}
                        
                        />
                    </div>
                    <div className="my-4">
                        <label  className="font-bold">E-mail</label>
                        <Input
                            placeholder="Digite o email"
                            type="email"
                            name="email"
                            register={register}
                            error={errors?.email?.message}
                        
                        />
                    </div>
                    <div className="my-4">
                        <label  className="font-bold">Password</label>
                        <Input
                            placeholder="Digite a password"
                            type="password"
                            name="password"
                            register={register}
                            error={errors?.password?.message}
                        
                        />
                    </div>
                    <div className="mb-4">
                        <label className="font-bold">Nível de acesso</label>
                        <SelectUser

                            name="role"
                            register={register}
                            options={role}
                            error={errors?.role?.message}
                        />
                    </div>
                    <div className="mb-4 col-span-3 flex justify-start">
                        <button
                            type="submit"
                            className="bg-zinc-800 hover:bg-zinc-500 text-white text-sm font-extrabold rounded-md px-4 py-2"
                        >
                            Cadastrar
                        </button>
                    </div>
                </form>
        </Container>
    )
}
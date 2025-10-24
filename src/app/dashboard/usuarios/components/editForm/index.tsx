"use client"

import { useState, useEffect } from "react"
import { db } from "@/services/firebaseConnection"
import { collection, doc, getDoc, updateDoc } from "firebase/firestore"
import { BsArrowLeft } from "react-icons/bs"
import Link from "next/link"
import Input from "../input"
import SelectUser from "@/app/dashboard/colaboradores/components/select"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import Container from "@/components/container"

interface EditProps{
    id: string;
}

interface User{
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
}

export const role = ["Admin", "Editor", "Visitante"]

const schema = z.object({
    name: z.string().min(2, "O nome deve conter no minímo 2 caracteres!").nonempty("O campo de nome é obrigatório!"),
    email: z.string().email("Insira um e-mail válido").nonempty("O campo de email é obrigatório!"),
    password: z.string().min(6, "A password deve conter no minímo 6 caracteres!").nonempty("O campo da password é obrigatório!"),
    role: z.enum(["Admin", "Editor", "Visitante"]).refine((val) => ["Admin", "Editor", "Visitante"].includes(val), {message: "Escolha inválida!"} )
})

type UserForm = z.infer<typeof schema>

export default function EditForm({id}: EditProps){

    const router = useRouter()
    const [userName, setUserName] = useState<string | null>(null);
    const [createdAt, setCreatedAt] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(schema), 
        mode: "onChange" 
    });

    useEffect(() => {
        async function loadUserDetail(id: string){
            if(!id) return;
            const getUser = doc(db, "users", id)
            const snapshot = await getDoc(getUser)

            if(!snapshot.exists()){
                toast.error("Usuário não encontrado");
                router.push("/dashboard/usuarios");
                return;
            }

            const data = snapshot.data();

            const createdAt =
            data?.createdAt?.toDate?.().toLocaleString("pt-PT") ||
            data?.createdAt ||
            null;

            setUserName(data?.name);
            setCreatedAt(createdAt);

            reset({
                name: data?.name,
                email: data?.email,
                password: data?.password,
                role: data?.role
            })

            setLoading(false)
        }

        loadUserDetail(id)

    }, [id, reset, router])

    async function onUpdate(data: UserForm){
        if(!id) return
        try {
            const docRef = doc(db, "users",id)
            await updateDoc(docRef, {
                ...data,
                updatedAt: new Date()
            })
            toast.success("Usuário atualizado com sucesso!");
            router.push("/dashboard/usuarios"); 
        } catch (error) {
            console.log(error)
            toast.error("Erro ao atualizar o usuário")
        }
    }

    if(loading){
        return(
            <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-600"></div>
              <p className="text-gray-600 font-medium">Carregando usuário...</p>
            </div>
        )
    }

    return(
        <Container>
            <div className="flex items-center justify-between flex-wrap">
                    <div className="bg-zinc-100 py-4 rounded-md text-sm text-zinc-700 leading-relaxed">
                        {userName && (
                            <p className="text-zinc-800">
                                A editar dados do projecto:{" "}
                                <span className="text-zinc-950 font-bold">{userName}</span>
                            </p>
                        )}
                        {createdAt && <p>Criado em: <strong>{createdAt}</strong></p>}
                    </div>
                <Link href="/dashboard/projectos" className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-900 text-white text-sm font-extrabold rounded-md px-4 py-2">
                    <BsArrowLeft size={18} color="#fff"/>
                    Voltar para projectos
                </Link>
            </div>
                
                <form
                    onSubmit={handleSubmit(onUpdate)}
                    className="bg-white p-5 rounded-md grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 gap-3 mt-2"
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
                            className="bg-zinc-800 hover:bg-zinc-900 cursor-pointer text-white text-sm font-extrabold rounded-md px-4 py-2 duration-300"
                        >
                            Salvar alterações
                        </button>
                    </div>
                </form>
        </Container>
    )
}
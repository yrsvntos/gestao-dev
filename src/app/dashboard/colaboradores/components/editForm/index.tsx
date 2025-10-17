"use client"
import { useState, useEffect } from "react";
import { db } from "@/services/firebaseConnection";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { userSchema, FormData, optionsContrato, optionsEstado, optionsGenero } from "@/components/schema/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputUser from "../input";
import SelectUser from "../select";
import Container from "@/components/container";
import toast from "react-hot-toast";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import { useRouter } from "next/navigation";



interface EditFormProps{
    id: string
}


export default function EditForm({ id }: EditFormProps){

    const router = useRouter();
    const [colaboradorNome, setColaboradorNome] = useState<string | null>(null);
    const [createdAt, setCreatedAt] = useState<string | null>(null);
    const [updatedAt, setUpdatedAt] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver    : zodResolver(userSchema), 
        mode: "onChange" 
    });

    useEffect(() => {


        async function getColaborador(id: string){
            if (!id) return;
        
            const getRef = doc(db, "colaboradores", id);
            const snapshot = await getDoc(getRef);
        
            if (!snapshot.exists()) {
                toast.error("Colaborador não encontrado");
                router.push("/dashboard/colaboradores");
            }
        
        
            const data = snapshot.data();

            // 🔹 Guarda o nome do colaborador
            setColaboradorNome(data?.nome || "Desconhecido");

            // 🔹 Converte data de nascimento (Timestamp → Date → string)
            const dataNascimento =
            data?.dataNascimento?.toDate?.().toISOString().split("T")[0] ||
            data?.dataNascimento ||
            "";

            // 🔹 Define datas formatadas para exibição
            const criadoEm =
            data?.criadoEm?.toDate?.().toLocaleString("pt-PT") ||
            data?.criadoEm ||
            null;
            const atualizadoEm =
            data?.atualizadoEm?.toDate?.().toLocaleString("pt-PT") ||
            data?.atualizadoEm ||
            null;

            setCreatedAt(criadoEm);
            setUpdatedAt(atualizadoEm)
        
            reset({
                nome: data?.nome,
                apelido: data?.apelido,
                email: data?.email,
                funcao: data?.funcao,
                departamento: data?.departamento,
                contrato: data?.contrato,
                estado: data?.estado,
                genero: data?.genero,
                dataNascimento,
                telefone: data?.telefone,
                morada: data?.morada,
            });
        }

        getColaborador(id);
    }, [id, reset, router])

    async function handleUpdate(data: FormData) {
        if (!id) return;
    
        try {
          const docRef = doc(db, "colaboradores", id);
          await updateDoc(docRef, {
            ...data,   
            atualizadoEm: new Date()   
          });
          toast.success("Colaborador atualizado com sucesso!");
          router.push("/dashboard/colaboradores"); 
        } catch (error) {
          console.log(error);
          toast.error("Erro ao atualizar colaborador!");
        }
    }

    return(
        <Container>
                <div className="flex items-center justify-between flex-wrap">
                    <h2 className="text-bold text-md">Editar colaborador</h2>
                    <Link href="/dashboard/colaboradores" className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-500 text-white text-sm font-extrabold rounded-md px-4 py-2">
                        <BsArrowLeft size={18} color="#fff"/>
                        Voltar para colaboradores
                    </Link>
                </div>
                {/* 🔹 Info do colaborador + datas */}
                    <div className="bg-zinc-100 py-4 rounded-md text-sm text-zinc-700 leading-relaxed">
                        {colaboradorNome && (
                        <p className="font-semibold text-zinc-800">
                            A editar dados do colaborador:{" "}
                            <span className="text-zinc-950 font-bold">{colaboradorNome}</span>
                        </p>
                        )}
                        {createdAt && <p>Criado em: <strong>{createdAt}</strong></p>}
                        {updatedAt && <p>Última atualização: <strong>{updatedAt}</strong></p>}
                    </div>
                <form
                    onSubmit={handleSubmit(handleUpdate)}
                    className="bg-white p-5 rounded-md grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 gap-3 mt-3"
                >
                    <div className="my-2">
                        <label  className="font-bold">Nome</label>
                        <InputUser
                            placeholder="Digite o nome"
                            type="text"
                            name="nome"
                            register={register}
                            error={errors?.nome?.message}
                        
                        />
                    </div>
                    <div className="my-4">
                        <label  className="font-bold">Apelido</label>
                        <InputUser
                            placeholder="Digite o apelido"
                            type="text"
                            name="apelido"
                            register={register}
                            error={errors?.apelido?.message}
                        
                        />
                    </div>
                    <div className="my-4">
                        <label  className="font-bold">E-mail corporativo</label>
                        <InputUser
                            placeholder="Digite o email corporativo"
                            type="email"
                            name="email"
                            register={register}
                            error={errors?.email?.message}
                        
                        />
                    </div>
                    <div className="mb-4">
                        <label  className="font-bold">Telefone</label>
                        <InputUser
                            placeholder="Digite o contacto"
                            type="tel"
                            name="telefone"
                            register={register}
                            error={errors?.telefone?.message}
                        
                        />
                    </div>
                    <div className="mb-4">
                        <label  className="font-bold">Morada</label>
                        <InputUser
                            placeholder="Digite a morada"
                            type="text"
                            name="morada"
                            register={register}
                            error={errors?.morada?.message}
                        
                        />
                    </div>
                    <div className="mb-4">
                        <label className="font-bold">Género</label>
                        <SelectUser

                            name="genero"
                            register={register}
                            options={optionsGenero}
                            error={errors?.genero?.message}
                        />
                    </div>
                    <div className="mb-4">
                        <label  className="font-bold">Data de Nascimento</label>
                        <InputUser
                            placeholder="Digite a função"
                            type="date"
                            name="dataNascimento"
                            register={register}
                            error={errors?.dataNascimento?.message}
                        
                        />
                    </div>
                    <div className="mb-4">
                        <label  className="font-bold">Função</label>
                        <InputUser
                            placeholder="Digite a função"
                            type="text"
                            name="funcao"
                            register={register}
                            error={errors?.funcao?.message}
                        
                        />
                    </div>
                    <div className="mb-4">
                        <label  className="font-bold">Departamento</label>
                        <InputUser
                            placeholder="Digite o departamento"
                            type="text"
                            name="departamento"
                            register={register}
                            error={errors?.departamento?.message}
                        
                        />
                    </div>
                    <div className="mb-4">
                        <label className="font-bold">Tipo de Contrato</label>
                        <SelectUser

                            name="contrato"
                            register={register}
                            options={optionsContrato}
                            error={errors?.contrato?.message}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="font-bold">Estado do colaborador</label>
                        <SelectUser

                            name="estado"
                            register={register}
                            options={optionsEstado}
                            error={errors?.estado?.message}
                        />
                    </div><br />
                    <div className="mb-4">
                        <button
                            type="submit"
                            className="cursor-pointer bg-zinc-800 hover:bg-zinc-500 text-white text-sm font-extrabold rounded-md px-4 py-2"
                        >
                            Salvar alterações
                        </button>
                    </div>
                </form>
        </Container>
    )
}
"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { db } from "@/services/firebaseConnection"
import { getDoc, updateDoc, doc } from "firebase/firestore"
import Link from "next/link"
import Container from "@/components/container"
import { projectoSchema, optionsStatus} from "@/components/schema/projectos"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import Input from "@/app/dashboard/components/input"
import Select from "@/app/dashboard/components/select"
import TextArea from "@/app/dashboard/components/textarea"
import { BsArrowLeft } from "react-icons/bs"
import { ProjectForm } from "@/components/schema/projectos"
import { useUserRole } from "@/hooks/userRole"

interface EditProps{
    id: string
}

export default function EditForm({id}: EditProps){
    

    const [projectName, setProjectName] = useState<string | null>(null);
    const [createdAt, setCreatedAt] = useState<string | null>(null);
    const [updatedAt, setUpdatedAt] = useState<string | null>(null);
    const router = useRouter()
    const {role} = useUserRole()

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver    : zodResolver(projectoSchema), 
        mode: "onChange" 
    });

    useEffect(() => {
        async function getProjectDetail(id: string){
            if(!id) return;
            const getRef = doc(db, "projectos", id)
            const snapshot = await getDoc(getRef);

            if (!snapshot.exists()) {
                toast.error("Projeto não encontrado");
                router.push("/dashboard/projectos");
                return;
                
            }

            const data = snapshot.data();

            // 🔹 Define datas formatadas para exibição
            const dataInicio =
            data?.dataInicio?.toDate?.().toISOString().split("T")[0] ||
            data?.dataInicio ||
            "";
            const dataFimPrevista =
            data?.dataFimPrevista?.toDate?.().toISOString().split("T")[0] ||
            data?.dataFimPrevista ||
            "";
            const dataFimReal =
            data?.dataFimReal?.toDate?.().toISOString().split("T")[0] ||
            data?.dataFimReal ||
            "";
            const criadoEm =
            data?.criadoEm?.toDate?.().toLocaleString("pt-PT") ||
            data?.criadoEm ||
            null;
            const atualizadoEm =
            data?.atualizadoEm?.toDate?.().toLocaleString("pt-PT") ||
            data?.atualizadoEm ||
            null;

            setProjectName(data?.nome)
            setCreatedAt(criadoEm);
            setUpdatedAt(atualizadoEm)

            reset({
                nome: data?.nome,
                referencia: data?.referencia,
                descricao: data?.descricao,
                clienteId: data?.clienteId,
                responsavel: data?.responsavel,
                departamento: data?.departamento,
                status: data?.status,
                dataInicio,
                dataFimPrevista,
                dataFimReal,
                valorOrcamento: Number(data?.valorOrcamento),      
                despesas: Number(data?.despesas),             
                receitas: Number(data?.receitas),
            })

        }
        getProjectDetail(id)
    }, [id, reset, router])

    async function onUpdate(data: ProjectForm ){
        if(!id) return
        try {
            const docRef = doc(db, "projectos", id)
            await updateDoc(docRef, {
                ...data,
                atualizadoEm: new Date()
            })
            toast.success("Projecto atualizado com sucesso!");
            router.push("/dashboard/projectos"); 
        } catch (error) {
            console.log(error)
            toast.error("Erro ao atualizar dados do projecto!");
        }
    }

    if (role !== "Admin" && role !== "Editor") {
        return (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)] text-center p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Acesso limitado
            </h2>
            <p className="text-gray-600 max-w-md">
              Lamentamos, mas a sua conta não possui permissões para este módulo.
              Se acredita que isto é um erro, entre em contacto com o administrador do sistema.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-6 bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition"
            >
              Voltar ao painel
            </button>
          </div>
        );
    }
    
    return(
        <>
            <Container>
                <div className="flex items-center justify-between flex-wrap">
                    <div className="bg-zinc-100 py-4 rounded-md text-sm text-zinc-700 leading-relaxed">
                        {projectName && (
                            <p className="text-zinc-800">
                                A editar dados do projecto:{" "}
                                <span className="text-zinc-950 font-bold">{projectName}</span>
                            </p>
                        )}
                        {createdAt && <p>Criado em: <strong>{createdAt}</strong></p>}
                        {updatedAt && <p>Última atualização: <strong>{updatedAt}</strong></p>}
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
                        <label  className="font-bold">Nome do Projecto</label>
                        <Input
                            placeholder="Digite o nome do projecto"
                            type="text"
                            name="nome"
                            register={register}
                            error={errors?.nome?.message}
                        
                        />
                    </div>
                    <div className="my-4">
                        <label  className="font-bold">Referência do Projecto</label>
                        <Input
                            placeholder="Digite o nome do projecto"
                            type="text"
                            name="referencia"
                            register={register}
                            error={errors?.referencia?.message}
                        
                        />
                    </div>
                    <div className="my-4">
                        <label  className="font-bold">Nome do Cliente</label>
                        <Input
                            placeholder="Digite o nome do cliente"
                            type="text"
                            name="clienteId"
                            register={register}
                            error={errors?.clienteId?.message}
                        
                        />
                    </div>
                    <div className="mb-4">
                        <label  className="font-bold">Nome do Responsável</label>
                        <Input
                            placeholder="Digite o nome do responsavel do projecto"
                            type="text"
                            name="responsavel"
                            register={register}
                            error={errors?.responsavel?.message}
                        
                        />
                    </div>
                    <div className="mb-4">
                        <label  className="font-bold">Nome do Departamento Responsável</label>
                        <Input
                            placeholder="Digite o nome do departamento responsavel do projecto"
                            type="text"
                            name="departamento"
                            register={register}
                            error={errors?.departamento?.message}
                        
                        />
                    </div>
                    <div className="mb-4">
                        <label  className="font-bold">Status do projecto</label>
                        <Select

                            name="status"
                            register={register}
                            options={optionsStatus}
                            error={errors?.status?.message}
                        />
                    </div>
                    <div className="mb-4">
                        <label  className="font-bold">Data de Início</label>
                        <Input
                            placeholder=""
                            type="date"
                            name="dataInicio"
                            register={register}
                            error={errors?.dataInicio?.message}
                        
                        />
                    </div>
                    <div className="mb-4">
                        <label  className="font-bold">Data de Fim Prevista</label>
                        <Input
                            placeholder=""
                            type="date"
                            name="dataFimPrevista"
                            register={register}
                            error={errors?.dataFimPrevista?.message}
                        
                        />
                    </div>
                    <div className="mb-4">
                        <label  className="font-bold">Data de Fim Real</label>
                        <Input
                            placeholder=""
                            type="date"
                            name="dataFimReal"
                            register={register}
                            error={errors?.dataFimReal?.message}
                        
                        />
                    </div>
                    <div className="mb-4">
                        <label  className="font-bold">Valor do Orçamento</label>
                        <Input
                            placeholder="Digite o valor do orçamento"
                            type="number"
                            name="valorOrcamento"
                            register={register}
                            error={errors?.valorOrcamento?.message}
                        
                        />
                    </div>
                    <div className="mb-4">
                        <label  className="font-bold">Despesas</label>
                        <Input
                            placeholder="Digite o valor das despesas"
                            type="number"
                            name="despesas"
                            register={register}
                            error={errors?.despesas?.message}
                        
                        />
                    </div>
                    <div className="mb-4">
                        <label  className="font-bold">Receitas</label>
                        <Input
                            placeholder="Digite o valor das receitas"
                            type="number"
                            name="receitas"
                            register={register}
                            error={errors?.receitas?.message}
                        
                        />
                    </div>
                    <div className="mb-4 col-span-3">
                        <label  className="font-bold">Descrição do projecto</label>
                        <TextArea
                            placeholder="Digite a descrição do projecto"
                            name="descricao"
                            register={register}
                            error={errors?.descricao?.message}
                        
                        />
                    </div>
                    <div className="mb-4 col-span-3 flex justify-start">
                        <button
                            type="submit"
                            className="bg-zinc-800 hover:bg-zinc-900 cursor-pointer text-white text-sm font-extrabold rounded-md px-4 py-2"
                        >
                            Salvar alterações
                        </button>
                    </div>
                </form>
        </Container>
        </>
    )
}
"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import InputConta from "../../../components/input";
import SelectConta from "../../../components/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema, categoriaOption, estadoOption, metodoPagamentoOption, ReceitaForm } from "@/components/schema/receitas";
import { db } from "@/services/firebaseConnection";
import { doc, getDoc, updateDoc} from "firebase/firestore";
import toast from "react-hot-toast";

import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/despesas/formatDate";
import { useUserRole } from "@/hooks/userRole";

interface EditProps{
    id: string;
}

export default function EditForm({id}: EditProps){

    const router = useRouter();
    const {role} = useUserRole()
    const [nomeReceita, setNomeReceita] = useState<string | null>(null);
    const [createdAt, setCreatedAt] = useState<string | null>(null);
    const [updatedAt, setUpdatedAt] = useState<string | null>(null);
    const [loading, setLoading] = useState(false)
    const {register, handleSubmit, formState: {errors}, reset} = useForm({
        resolver: zodResolver(schema),
        mode: "onChange"
    })

    

    useEffect(() => {
        async function GetDetailReceita(id: string){
            const getRef = doc(db, "receitas", id)
            const snapshot = await getDoc(getRef)
    
            if(!snapshot.exists()){
                toast.error("Receita não encontrada");
                router.push("/dashboard/financeiro/receitas");
                return
                
            }

            const dados = snapshot.data();

            const data = dados.data?.toDate?.().toISOString().split("T")[0] || dados.data || "";
            const criadoEm = dados.criadoEm?.toDate?.() || new Date(dados.criadoEm);
            const atualizadoEm = dados.atualizadoEm?.toDate?.() || new Date(dados.atualizadoEm) || "";
            
            setNomeReceita(dados?.descricao)
            setCreatedAt(criadoEm)
            setUpdatedAt(atualizadoEm)

            reset({
                descricao: dados.descricao,
                valor: Number(dados.valor),
                categoria: dados.categoria,
                data,
                metodoPagamento: dados.metodoPagamento,
                estado: dados.estado,
                observacoes: dados.observacoes,
            })

            setLoading(false)
        }
        GetDetailReceita(id);
    }, [id, router, reset])

    async function onUpdate(data: ReceitaForm){
        if(!id) return;
        try {
            const getRef = doc(db, "receitas", id)
            await updateDoc(getRef, {
                ...data,
                atualizadoEm: new Date(),
            })
            toast.success("Receita atualizada com sucesso!");
            router.push("/dashboard/financeiro/receitas")
        } catch (error) {
            toast.error("Erro ao atualizar receita")
            console.log("Erro ao atualizar a receita", error)
        }
        
    }

    if(loading){
        return(
            <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-600"></div>
              <p className="text-gray-600 font-medium">Carregando detalhes da despesa...</p>
            </div>
        )
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
           <div className="flex items-center justify-between">
                <div>
                    {nomeReceita && (
                        <p className="text-zinc-800">
                            A editar dados do projecto:{" "}
                            <span className="text-zinc-950 font-bold">{nomeReceita}</span>
                        </p>
                    )}
                    {createdAt && <p>Criado em: <strong>{formatDate(createdAt)}</strong></p>}
                    {updatedAt && <p>Última atualização: <strong>{formatDate(updatedAt)}</strong></p>}
                </div>
                <Link
                    href="/dashboard/financeiro/receitas"
                    className="flex items-center gap-2 bg-black text-white py-2 px-3 rounded text-sm cursor-pointer font-extrabold"
                >
                    <FiArrowLeft size={20} color="#fff"/>
                    Voltar para receitas
                </Link>
            </div>
            <form 
                onSubmit={handleSubmit(onUpdate, errors => console.log(errors))}
                className="w-full bg-white p-4 rounded mt-6 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1  gap-3"
            >
                <div className="my-4">
                    <label>Descrição da receita</label>
                    <InputConta
                        type="text"
                        placeholder="Descrição da receita"
                        name="descricao"
                        register={register}
                        error={errors.descricao?.message}
                    
                    />
                </div>
                <div className="my-4">
                    <label>Valor da receita</label>
                    <InputConta
                        type="number"
                        placeholder="Valor da receita"
                        name="valor"
                        register={register}
                        error={errors.valor?.message}
                    
                    />
                </div>
                <div className="my-4">
                    <label>Categoria da receita</label>
                    <SelectConta
                        name="categoria"
                        register={register}
                        options={categoriaOption}
                        error={errors?.categoria?.message}
                    />
                </div>
                <div className="mb-4">
                    <label> Metodo de Pagamento</label>
                    <SelectConta
                        name="metodoPagamento"
                        register={register}
                        options={metodoPagamentoOption}
                        error={errors?.metodoPagamento?.message}
                    />
                </div>
                <div className="mb-4">
                    <label>Data</label>
                    <InputConta
                        name="data"
                        type="date"
                        register={register}
                        placeholder=""
                        error={errors?.data?.message}
                    />
                </div>
                <div className="mb-4">
                    <label> Estado da receita</label>
                    <SelectConta
                        name="estado"
                        register={register}
                        options={estadoOption}
                        error={errors?.estado?.message}
                    />
                </div>
                <div className="mb-4 col-span-3">
                    <label>Observações</label>
                    <InputConta
                        type="text"
                        name="observacoes"
                        placeholder="Digite as observações"
                        register={register}
                        error={errors.observacoes?.message}
                    />
                </div>
                <div className="mb-4 col-span-3">
                    <button
                        type="submit"
                        className="bg-zinc-800 hover:bg-zinc-950 duration-300 cursor-pointer text-white py-1 px-2 rounded"
                    >
                        Salvar alterações
                    </button>
                </div>
            </form>
        </>
    )
}
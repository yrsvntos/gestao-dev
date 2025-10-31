"use client"
import { useEffect, useState } from "react";
import Container from "@/components/container";
import InputConta from "../input";
import SelectConta from "../select";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContaForm, contaschema, optionsEstado, optionsPagamento } from "@/components/schema/despesas";
import { useUserRole } from "@/hooks/userRole";
import { db } from "@/services/firebaseConnection";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { formatDate } from "@/utils/despesas/formatDate";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface EditProps{
    id: string;
}

export default function Edit({id}: EditProps){

    const [despesaName, setDespesaName] = useState<string | null>(null);
    const [createdAt, setCreatedAt] = useState<string | null>(null);
    const [updatedAt, setUpdatedAt] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const {role} = useUserRole();
    const router = useRouter();
    const {register, handleSubmit, formState: {errors}, reset} = useForm({
        resolver: zodResolver(contaschema),
        mode: "onChange"
    })

    useEffect(() => {
        async function loadDespesa(id: string){
            if(!id) return

            const getRef = doc(db, "despesas", id)
            const snapshot = await getDoc(getRef);

            if(!snapshot.exists()){
                toast.error("Despesa não encontrada!");
                router.replace("/dashboard/financeiro/despesas/")
                return
            }

            const data = snapshot.data();

            const dataEmissao = data.dataEmissao?.toDate?.().toISOString().split("T")[0] || data.dataEmissao || "";
            const dataVencimento = data.dataVencimento?.toDate?.().toISOString().split("T")[0]  || new data.dataVencimento || "";
            const criadoEm = data.criadoEm?.toDate?.() || new Date(data.criadoEm);
            const atualizadoEm = data.atualizadoEm?.toDate?.() || new Date(data.atualizadoEm) || "";

            setDespesaName(data?.entidade)
            setCreatedAt(criadoEm);
            setUpdatedAt(atualizadoEm)

            reset({
                entidade: data?.entidade,
                valor: Number(data?.valor),
                descricao: data?.descricao,
                dataVencimento,
                dataEmissao,
                estado: data?.estado,
                metodoPagamento: data?.metodoPagamento,
            })

            setLoading(false)
        }

        loadDespesa(id)
    }, [id, reset, router])

    async function onUpdate(data: ContaForm) {
        if(!id) return;
        try {
            const docRef = doc(db, "despesas", id);
            updateDoc(docRef, {
                ...data,
                atualizadoEm: new Date()
            }) 
            toast.success("Despesa atualizad com sucesso!")
            router.push("/dashboard/financeiro/despesas/")
        } catch (error) {
            toast.error("Erro ao atualizar a despesa.")
            console.log(error)
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
        <Container>
            <div className="flex justify-between">
                <div>
                    {despesaName && (
                        <p className="text-zinc-800">
                            A editar dados do projecto:{" "}
                            <span className="text-zinc-950 font-bold">{despesaName}</span>
                        </p>
                    )}
                    {createdAt && <p>Criado em: <strong>{formatDate(createdAt)}</strong></p>}
                    {updatedAt && <p>Última atualização: <strong>{formatDate(updatedAt)}</strong></p>}
                </div>
                
                <Link
                    href="/dashboard/financeiro/despesas"
                    className="flex items-center gap-2 bg-black text-white h-11 px-3 rounded text-sm cursor-pointer font-extrabold"
                >
                    <FiArrowLeft size={20} color="#fff"/>
                    Voltar para despesas
                </Link>
            </div>
            <form
                onSubmit={handleSubmit(onUpdate, (errors) => console.log(errors))}
                className="w-full bg-white p-4 rounded mt-6 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1  gap-3"
            >   
                <div className="my-4">
                    <label className="font-bold">Nome da Entidade</label>
                    <InputConta
                        type="text"
                        name="entidade"
                        placeholder="Digite o nome da entidade"
                        register={register}
                        error={errors.entidade?.message}

                    />
                </div>
                <div className="my-4">
                    <label className="font-bold">Descrição</label>
                    <InputConta
                        type="text"
                        name="descricao"
                        placeholder="Digite a descrição da despesa"
                        register={register}
                        error={errors.descricao?.message}

                    />
                </div>
                <div className="my-4">
                    <label className="font-bold">Valor da despesa</label>
                    <InputConta
                        type="number"
                        name="valor"
                        placeholder="Digite o valor da despesa"
                        register={register}
                        error={errors.valor?.message}

                    />
                </div>
                <div className="mb-4">
                    <label className="font-bold">Estado da despesa</label>
                    <SelectConta
                        name="estado"
                        register={register}
                        options={optionsEstado}
                        error={errors?.estado?.message}
                    />
                </div>
                <div className="mb-4">
                    <label className="font-bold">Metódo de Pagamento</label>
                    <SelectConta
                        name="metodoPagamento"
                        register={register}
                        options={optionsPagamento}
                        error={errors?.metodoPagamento?.message}

                    />
                </div>
                <div className="mb-4">
                    <label className="font-bold">Data Emissão</label>
                    <InputConta
                        type="date"
                        name="dataEmissao"
                        placeholder="Escolha a data de Emissão"
                        register={register}
                        error={errors.dataEmissao?.message}

                    />
                </div>
                <div className="mb-4">
                    <label className="font-bold">Data Vencimento</label>
                    <InputConta
                        type="date"
                        name="dataVencimento"
                        placeholder="Escolha a data de Vencimento"
                        register={register}
                        error={errors.dataVencimento?.message}

                    />
                </div>
                <div className="mb-4 flex col-span-3">
                    <button
                        type="submit"
                        className="bg-zinc-800 hover:bg-zinc-950 duration-300 cursor-pointer text-white py-1 px-2 rounded"
                    >
                        Cadastrar
                    </button>
                </div>
            </form>
        </Container>
    );
}
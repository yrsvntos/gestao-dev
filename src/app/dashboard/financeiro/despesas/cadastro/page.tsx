"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Container from "@/components/container";
import { FiArrowLeft} from "react-icons/fi";
import { contaschema, ContaForm, optionsEstado, optionsPagamento } from "@/components/schema/despesas";
import InputConta from "../../components/input";
import SelectConta from "../../components/select";
import TextareaConta from "../../components/textarea/input";
import { useUserRole } from "@/hooks/userRole";
import { db } from "@/services/firebaseConnection";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { getAuth, onAuthStateChanged } from "firebase/auth";


export default function Cadastro(){

    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const {role} = useUserRole();
    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: zodResolver(contaschema),
        mode: "onChange"
    }) 

    
    const auth = getAuth();
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
          setUser(u);
          setLoading(false);
        });
    
        return () => unsubscribe();
    }, [auth]);

    async function onSubmit(data: ContaForm){
        if (!user) {
            toast.error("Usuário não carregado ainda");
            return;
          }
        const getRef = collection(db, "despesas")

        try{
            const docRef = await addDoc(getRef, {
                entidade: data.entidade,
                valor: Number(data.valor),
                estado: data.estado,
                metodoPagamento: data.metodoPagamento,
                dataEmissao: data.dataEmissao ? Timestamp.fromDate(new Date(data.dataEmissao)) : null,
                dataVencimento: data.dataVencimento ? Timestamp.fromDate(new Date(data.dataVencimento)) : null,
                criadoEm: new Date(),
                atualizadoEm: new Date(),
                criadoPor: {
                    uid: user.uid,
                    nome: user.displayName || "Sem nome",
                    email: user.email || "sem-email",
                },
            })
            console.log(docRef)
            toast.success("Despesa cadastrada com sucesso")
            router.push("/dashboard/financeiro/despesas/")
        }catch(error){
            toast.error("Erro ao cadastrar nova despesa");
            console.log(error)
        }
        
    }
    
    if (role !== "Admin" && role !== "Editor") {
        return (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)] text-center p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Acesso limitado
            </h2>
            <p className="text-gray-600 max-w-md">
              Lamentamos, mas a sua conta não possui permissões para cadastrar novos projectos.
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
            <div className="flex items-center justify-between">
                <h2 className="font-medium">Cadastrar nova despesa</h2>
                <Link
                    href="/dashboard/financeiro/despesas"
                    className="flex items-center gap-2 bg-black text-white py-2 px-3 rounded text-sm cursor-pointer font-extrabold"
                >
                    <FiArrowLeft size={20} color="#fff"/>
                    Voltar para despesas
                </Link>
            </div>
            <form
                onSubmit={handleSubmit(onSubmit, (errors) => console.log(errors))}
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
                    <label className="font-bold">Valor da despesa</label>
                    <InputConta
                        type="number"
                        name="valor"
                        placeholder="Digite o valor da despesa"
                        register={register}
                        error={errors.valor?.message}

                    />
                </div>
                <div className="my-4">
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
                <div className="mb-4 col-span-3">
                    <label className="font-extrabold">Descrição</label>
                    <TextareaConta
                        placeholder="Digite a descrição da despesa"
                        name="descricao"
                        register={register}
                        error={errors.descricao?.message}
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
    )
}
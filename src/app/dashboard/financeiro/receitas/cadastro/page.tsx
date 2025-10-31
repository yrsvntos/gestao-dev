"use client"
import { useState, useEffect } from "react";
import { useUserRole } from "@/hooks/userRole"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReceitaForm, schema } from "@/components/schema/receitas";
import { FiArrowLeft } from "react-icons/fi";
import InputConta from "../../components/input";
import SelectConta from "../../components/select";
import { categoriaOption, estadoOption, metodoPagamentoOption } from "@/components/schema/receitas";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/services/firebaseConnection";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import toast from "react-hot-toast";



export default function Cadastro(){
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const route = useRouter();
    const {role} = useUserRole();

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: zodResolver(schema),
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

    async function onSubmit(data: ReceitaForm){
        const getRef = collection(db, "receitas")
        try {
            const docRef = await addDoc(getRef, {
                descricao: data.descricao,
                valor: Number(data.valor),
                categoria: data.categoria,
                data:  data.data ? Timestamp.fromDate(new Date(data.data)) : null,
                metodoPagamento: data.metodoPagamento,
                estado: data.estado,
                observacoes: data.observacoes || "",
                criadoEm: new Date(),
                atualizadoEm: new Date(),
                criadoPor: {
                    uid: user.uid || "",
                    nome: user.displayName || "Sem nome",
                    email: user.email || "sem-email",
                }
            })
            console.log(docRef)
            toast.success("Nova despesa cadastrada com sucesso!")
            route.push("/dashboard/financeiro/receitas")
        } catch (error) {
            toast.error("Erro ao cadastrar nova receita!")
            console.log(error)
        }
    }

    return(
        <>
            <div className="flex items-center justify-between">
                <h2 className="font-medium">Cadastrar nova receita</h2>
                <Link
                    href="/dashboard/financeiro/receitas"
                    className="flex items-center gap-2 bg-black text-white py-2 px-3 rounded text-sm cursor-pointer font-extrabold"
                >
                    <FiArrowLeft size={20} color="#fff"/>
                    Voltar para receitas
                </Link>
            </div>
            <form 
                onSubmit={handleSubmit(onSubmit, errors => console.log(errors))}
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
                        Cadastrar
                    </button>
                </div>
            </form>
        </>
    )
}
"use client";

import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Container from "@/components/container";
import Link from "next/link";
import { useForm } from "react-hook-form";
import Input from "../../components/input";
import Select from "../../components/select";
import { db } from "@/services/firebaseConnection";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { projectoSchema, optionsStatus, ProjectForm } from "@/components/schema/projectos";
import { zodResolver } from "@hookform/resolvers/zod";
import { BsArrowLeft } from "react-icons/bs";
import TextArea from "../../components/textarea";
import toast from "react-hot-toast";
import { useUserRole } from "@/hooks/userRole";


export default function Cadastro(){

    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const {role} = useUserRole();


    const auth = getAuth();
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
          setUser(u);
          setLoading(false);
        });
    
        return () => unsubscribe();
      }, [auth]);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(projectoSchema), 
        mode: "onChange" 
    });

    async function onSubmit(data: ProjectForm){
        if (!user) {
            toast.error("Usuário não autenticado!");
            return;
        }
        const getRef = collection(db, "projectos")

        try {
            const docRef = await addDoc(getRef, {
                nome: data.nome,
                referencia: data.referencia,
                descricao: data.descricao,
                clienteId: data.clienteId,
                responsavel: data.responsavel,
                departamento: data.departamento,
                status: data.status,
                dataInicio: Timestamp.fromDate(new Date(data.dataInicio)),
                dataFimPrevista: data.dataFimPrevista ? Timestamp.fromDate(new Date(data.dataFimPrevista)) : null,
                dataFimReal: data.dataFimReal ? Timestamp.fromDate(new Date(data.dataFimReal)) : null,
                valorOrcamento: Number(data.valorOrcamento),      
                despesas: Number(data.despesas),             
                receitas: Number(data.receitas),
                criadoEm: new Date(),
                atualizadoEm: new Date(),
                criadoPor: {
                    uid: user.uid,
                    nome: user.displayName || "Sem nome",
                    email: user.email || "sem-email",
                },
            })

            console.log(docRef)
            toast.success("Projecto cadastrado com sucesso!");
            router.push("/dashboard/projectos")
        } catch (error) {
            toast.error("Erro ao cadastrar o projecto!")
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

            <div className="flex items-center justify-between flex-wrap">
                <h2 className="text-bold text-md">Cadastrar novo projecto.</h2>
                <Link href="/dashboard/projectos" className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-900 text-white text-sm font-extrabold rounded-md px-4 py-2">
                    <BsArrowLeft size={18} color="#fff"/>
                    Voltar para projectos
                </Link>
            </div>
    
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-5 rounded-md grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 gap-3 mt-8"
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
                        Cadastrar
                    </button>
                </div>
            </form>
                
               
        </Container>
    );

}
"use client";

import Container from "@/components/container";
import { useForm } from "react-hook-form";
import { userSchema, FormData, optionsContrato, optionsEstado, optionsGenero } from "@/components/schema/users";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { db } from "@/services/firebaseConnection";
import { addDoc, collection } from "firebase/firestore";
import { BsArrowLeft } from "react-icons/bs";
import InputUser from "../../components/input";
import SelectUser from "../../components/select";
import toast from "react-hot-toast";



export default function Cadastro(){
    const router = useRouter();
    // Criar o formulário usando React Hook Form
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(userSchema), // <-- Aqui usamos o zodResolver
        mode: "onChange" // vai registar tudo sempre que o user modificar algo no input
    });


    async function onSubmit(data: FormData){
        
        
        const queryRef = collection(db, "colaboradores");

        try {

            const docRef = await addDoc(queryRef, {
                nome: data.nome,
                apelido: data.apelido,
                email: data.email,
                funcao: data.funcao,
                departamento: data.departamento,
                contrato: data.contrato,
                estado: data.estado,
                genero: data.genero,
                dataNascimento: data.dataNascimento,
                telefone: data.telefone,
                morada: data.morada,
                criadoEm: new Date(),
                atualizadoEm: new Date(),
            });

            console.log(docRef)
            
            toast.success("Colaborador cadastrado no sistema!");
            router.push("/dashboard/colaboradores");

        } catch (error) {
            console.log(error)
            toast.error("Erro ao cadastrar colaborador no sistema!")
        }



    }

    return(
        <>
            <Container>
                <div className="flex items-center justify-between flex-wrap">
                    <h2 className="text-bold text-md">Cadastrar novo colaborador.</h2>
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
                        <InputUser
                            placeholder="Digite o nome"
                            type="nome"
                            name="nome"
                            register={register}
                            error={errors?.nome?.message}
                        
                        />
                    </div>
                    <div className="my-4">
                        <label  className="font-bold">Apelido</label>
                        <InputUser
                            placeholder="Digite o apelido"
                            type="apelido"
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
                            type="telefone"
                            name="telefone"
                            register={register}
                            error={errors?.telefone?.message}
                        
                        />
                    </div>
                    <div className="mb-4">
                        <label  className="font-bold">Morada</label>
                        <InputUser
                            placeholder="Digite a morada"
                            type="morada"
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
                            type="funcao"
                            name="funcao"
                            register={register}
                            error={errors?.funcao?.message}
                        
                        />
                    </div>
                    <div className="mb-4">
                        <label  className="font-bold">Departamento</label>
                        <InputUser
                            placeholder="Digite o departamento"
                            type="departamento"
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
                            className="bg-zinc-800 hover:bg-zinc-500 text-white text-sm font-extrabold rounded-md px-4 py-2"
                        >
                            Cadastrar
                        </button>
                    </div>
                </form>
            </Container>
        </>
    )
}
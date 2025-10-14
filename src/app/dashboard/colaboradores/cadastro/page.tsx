"use client";

import Container from "@/components/container";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import { UserProps } from "@/utils/user";
import InputUser from "../../components/input";
import SelectUser from "../../components/select";


const userSchema = z.object({
    id: z.union([z.string(), z.number()]).optional(),
    nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres.").max(100, "O nome não pode ter mais de 100 caracteres."),
    apelido: z.string().optional(),
    email: z.string().email("Insira um e-mail válido.").max(120, "O e-mail não pode ultrapassar 120 caracteres."),
    funcao: z.string().min(2, "Informe a função do colaborador."),
    departamento: z.string().min(2, "Informe o departamento."),
    contrato: z.enum(["Efetivo", "Temporário", "Estagiário"]).refine(
        (val) => ["Efetivo", "Temporário", "Estagiário"].includes(val),
        { message: "Tipo de contrato inválido." }
    ),
    estado: z.enum(["Ativo", "Inativo"]).refine(
        (val) => ["Ativo", "Inativo"].includes(val),
        { message: "Estado inválido." }
    ),
    genero: z.enum(["Masculino", "Feminino"]).refine(
        (val) => ["Masculino", "Feminino"].includes(val),
        { message: "Gênero inválido." }
    ),
    dataNascimento: z
    .preprocess((val) => (typeof val === "string" ? new Date(val) : val), z.date({
        error: "A data de nascimento é obrigatória.",
    })),
    telefone: z.string()
    .regex(/^[0-9+\-\s()]+$/, "Número de telefone inválido.")
    .optional(),
    morada: z.string().optional(),
    criadoEm: z.date().optional(),
    atualizadoEm: z.date().optional(),
})


type FormData = z.infer<typeof userSchema>


export default function Cadastro(){

    // Criar o formulário usando React Hook Form
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(userSchema), // <-- Aqui usamos o zodResolver
        mode: "onChange" // vai registar tudo sempre que o user modificar algo no input
    });

    const optionsGenero = ["Masculino", "Feminino"];
    const optionsEstado = ["Ativo", "Inativo"];
    const optionsContrato = ["Efetivo", "Temporário", "Estagiário"];

    function onSubmit(data: FormData){
        alert("teste");
    }

    return(
        <>
            <Container>
                <div className="flex items-center justify-between flex-wrap">
                    <h2 className="text-bold text-md">Cadastrar novo colaborador.</h2>
                    <Link href="/dashboard/usuarios" className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-500 text-white text-sm font-extrabold rounded-md px-4 py-2">
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
                            type="apelido"
                            name="apelido"
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
import z from "zod"


export const userSchema = z.object({
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

export const optionsGenero = ["Masculino", "Feminino"];
export const optionsEstado = ["Ativo", "Inativo"];
export const optionsContrato = ["Efetivo", "Temporário", "Estagiário"];

export type FormData = z.infer<typeof userSchema>

import z from "zod";

export const schema = z.object({
    descricao: z.string().nonempty("A descrição da despesa é obrigatória"),
    valor: z.preprocess((v) => Number(v), z.number().positive("O valor deve ser positivo.")),
    categoria: z.enum(["Mensalidade de Cursos", "Projetos", "Outras Receitas"]),
    estado: z.enum(["Recebida", "Pendente", "Cancelada"]),
    metodoPagamento: z.enum(["Dinheiro", "Transferência", "Cartão", "Conta Móvel"]),
    data: z
    .preprocess((val) => val ? new Date(val as string) : undefined, z.date({
        error: "A data de emissão da receita é obrigatória.",
    })).optional(),
    observacoes: z.string().optional()

})

export type ReceitaForm = z.infer<typeof schema>
export const categoriaOption = ["Mensalidade de Cursos", "Projetos", "Outras Receitas"];
export const estadoOption = ["Recebida", "Pendente", "Cancelada"];
export const metodoPagamentoOption = ["Dinheiro", "Transferência", "Cartão", "Conta Móvel"];
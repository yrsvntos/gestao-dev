import z from "zod";

export const projectoSchema = z.object({
    id: z.union([z.string(), z.number()]).optional(),
    nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres.").max(200, "O nome não pode ter mais de 200 caracteres."),
    referencia: z.string().min(2, "A referência deve ter pelo menos 2 caracteres.").max(50, "A referência não pode ter mais de 50 caracteres."),
    departamento: z.string().min(2, "O departamento deve ter pelo menos 2 caracteres.").max(50, "O departamento não pode ter mais de 50 caracteres."),
    descricao: z.string().min(2, "A descrição deve ter pelo menos 2 caracteres.").max(500, "A descrição não pode ter mais de 500 caracteres."),
    clienteId: z.string().min(2, "O nome do cliente deve ter pelo menos 2 caracteres.").max(60, "O nome do cliente não pode ter mais de 60 caracteres."),
    responsavel: z.string().min(2, "O nome do responsável deve ter pelo menos 2 caracteres.").max(20, "O nome do responsável não pode ter mais de 20 caracteres."),
    dataInicio: z
    .preprocess((val) => (typeof val === "string" ? new Date(val) : val), z.date({
        error: "A data de início do projecto é obrigatória.",
    })),
    dataFimPrevista: z
    .preprocess((val) => (typeof val === "string" ? new Date(val) : val), z.date({
        error: "A data de final prevista do projecto é obrigatória.",
    })).optional(),
    dataFimReal: z.preprocess(
        (val) => {
          if (!val || val === "") return undefined;
          return typeof val === "string" ? new Date(val) : val;
        },
        z.date().optional()
      ),
    valorOrcamento: z.preprocess((v) => Number(v), z.number().positive("O valor do orçamento deve ser positivo.")),
    despesas: z.preprocess((v) => Number(v), z.number().min(0, "As despesas não podem ser negativas.")).optional(),
    receitas: z.preprocess((v) => Number(v), z.number().min(0, "As receitas não podem ser negativas.")).optional(),
    status: z.enum(["Planejado", "Em Andamento", "Concluído", "Pausado"]).refine(
        (val) => ["Planejado", "Em Andamento", "Concluído", "Pausado"].includes(val),
        { message: "Estado inválido." }
    )
})

.refine(
    (data) => !data.dataFimPrevista || data.dataFimPrevista > data.dataInicio,
    { message: "A data de fim prevista deve ser posterior à data de início.", path: ["dataFimPrevista"] }
)
.refine(
    (data) => !data.dataFimReal || data.dataFimReal >= data.dataInicio,
    { message: "A data de fim real deve ser posterior à data de início.", path: ["dataFimReal"] }
);

export type ProjectForm = z.infer<typeof projectoSchema>

export const optionsStatus = ["Planejado", "Em Andamento", "Concluído", "Pausado"];
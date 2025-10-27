import z from "zod";


const contasSchema = z.object({
    entidade: z.string().min(1, "O nome da entidade deve ter pelo menos um caracter"),
    descricao: z.string().min(5, "A descrição deve ter no minímo 50 caracteres"),
    valor: z.string().nonempty("Valor da conta é obrigatório"),
    status: 
        z.enum(["Aberto", "Pago", "Atrasado"]),
    metodoPagamento: 
        z.enum(["Dinheiro", "Transf. Bancária", "Cartão Bancário"]),
    dataEmissao: z
    .preprocess((val) => (typeof val === "string" ? new Date(val) : val), z.date({
        error: "A data de emissão é obrigatória.",
    })),
    dataVencimento: z
    .preprocess((val) => (typeof val === "string" ? new Date(val) : val), z.date({
        error: "A data de vencimento é obrigatória.",
    })),
    anexoURL: z.string().url().optional()


})

.refine(
    (data) => !data.dataVencimento || data.dataVencimento >= data.dataEmissao,
    { message: "A data de vencimento deve ser posterior ou igual à data de emissão.", path: ["dataVencimento"] }
)
  

type FormData = z.infer<typeof contasSchema>

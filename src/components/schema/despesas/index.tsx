import z from "zod";

export const contaschema = z.object({
    entidade: z.string().nonempty("O nome da entidade é obrigatória"),
    valor: z.string().nonempty("O valor deve ser positivo!"),
    estado: z.enum(["Pago", "Pendente", "Cancelada"]),
    metodoPagamento: z.enum(["Dinheiro", "Transferência",  "Cartão"]),
    dataEmissao: z
    .preprocess((val) => val ? new Date(val as string) : undefined, z.date({
        error: "A data de emissão da despesa é obrigatória.",
    })).optional(),
    dataVencimento: z
    .preprocess((val) => val ? new Date(val as string) : undefined, z.date({
        error: "A data de vencimento da despesa é obrigatória.",
    })).optional(),
    descricao: z.string().nonempty("A descrição da entidade é obrigatória")


})

.refine(
    (data) => {
      if (!data.dataEmissao || !data.dataVencimento) return true; // não validar se alguma estiver vazia
      return data.dataVencimento > data.dataEmissao;
    },
    { message: "A data de fim prevista deve ser posterior à data de início.", path: ["dataVencimento"] }
  )

export type ContaForm = z.infer<typeof contaschema>
export const optionsEstado = ["Pago", "Pendente", "Cancelada"];
export const optionsPagamento = ["Dinheiro", "Transferência", "Cartão"];
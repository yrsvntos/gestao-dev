export interface DespesaProps{
    despesaId: string;
    entidade: string;
    valor: number;
    descricao: string;
    dataVencimento?: Date;
    dataEmissao?: Date;
    estado: "Pago" | "Pendente" | "Cancelada";
    metodoPagamento: "Dinheiro" | "Transferência" | "Cartão";
    criadoEm: Date;
    atualizadoEm?: Date;
    criadoPor: {
        uid: string;
        nome: string;
    }

}
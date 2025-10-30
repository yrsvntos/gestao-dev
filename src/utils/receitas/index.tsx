export interface ReceitaProps{
    receitaId: string;
    descricao: string;
    valor: number;
    categoria: string;
    data?:  Date;
    metodoPagamento: "Dinheiro" | "Transferência" | "Cartão" | "Conta Móvel";
    estado: "Recebida" | "Pendente" | "Cancelada";
    observacoes: string;
    criadoEm: Date;
    atualizadoEm?: Date;
    criadoPor: {
        uid: string;
        nome: string;
    }

}
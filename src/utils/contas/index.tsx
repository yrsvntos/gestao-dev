

interface ContasProps{
    contaId: string;
    entidade: string;
    descricao: string;
    valor: string;
    status: "Aberto" | "Pago" | "Atrasado";
    metodoPagamento: "Dinheiro" | "Transf. Bancária" | "Cartão Bancário";
    anexoURL?: string;
    dataEmissao: Date;
    dataVencimento: Date;
    criadoEm: Date;
    atualizadoEm: Date;
    criadoPor: {
        uid: string;
        nome: string;
    };

}
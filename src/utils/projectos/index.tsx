export interface ProjectosProps{
    id: string;
    nome: string;
    descricao?: string;
    clienteId?: string;             // referência ao cliente
    responsavel: string;  
    departamento?: string;      
    status: "Planejado" | "Em Andamento" | "Concluído" | "Pausado";
    dataInicio: Date;
    referencia?: string;
    dataFimPrevista?: Date;
    dataFimReal?: Date;
    valorOrcamento?: number;      
    despesas?: number;             
    receitas?: number;                        
    criadoEm: Date;
    atualizadoEm?: Date;
    criadoPor: {
        uid: string;
        nome: string;
    };
}

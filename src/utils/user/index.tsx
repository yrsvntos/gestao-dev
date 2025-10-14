export interface UserProps {
    id?: number | string;
    nome: string;
    apelido?: string;
    email: string;
    funcao: string;
    departamento: string;
    contrato: 'Efetivo' | 'Temporário' | 'Estagiário';
    estado: 'Ativo' | 'Inativo';
    genero: 'Masculino' | 'Feminino';
    dataNascimento: Date;
    telefone?: string;
    morada?: string;
    criadoEm?: Date;
    atualizadoEm?: Date;
}
  
export interface Estoque {
   
    id?:        any;
    descricao: string;
    quantidadeAtual: number;
    valorUnitario?: number;
    tipo: string;
    motivo: string;
    data_registro: string;
    insumo_fk: number;
}
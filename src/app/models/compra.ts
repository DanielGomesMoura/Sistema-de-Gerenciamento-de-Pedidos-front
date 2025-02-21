import { ItensCompra } from "./itensCompra";

export interface Compra{

     id?:                 any;
     data_registro:       string;
     fornecedor:          string;
     valor_total:         number;
     nota_fiscal:         string;
     tipo_recebimento_fk: number;
     conta:               string;
     forma_pagamento:     string;
     itensCompra?: ItensCompra[];
}
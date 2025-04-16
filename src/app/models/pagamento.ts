
export interface Pagamento {
    id?: any;
    data_registro_pagamento: string;
    tipo_pagamento: string;
    valor_pagamento: number|string;
    pedido_fk: number;
    pedido_fk_lote: number[];
    
}
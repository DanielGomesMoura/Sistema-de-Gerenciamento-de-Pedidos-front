import { TipoRecebimentoService } from 'src/app/services/tipo-recebimento.service';
import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Tipo_Recebimento } from 'src/app/models/tipo-recebimento';
import { TipoRecebimentoSimplificado } from 'src/app/models/combo-recebimento';
import { PagamentoService } from 'src/app/services/pagamento.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { DatePipe } from '@angular/common';
import { parse } from 'date-fns';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-pagamento-create',
  templateUrl: './pagamento-create.component.html',
  styleUrls: ['./pagamento-create.component.css']
})
export class PagamentoCreateComponent implements OnInit {

  pagamentoForm: FormGroup;
  isEditMode: boolean = false;
  tipo_Recebimento: TipoRecebimentoSimplificado[] = [];
  pedidoId: number;
  valorTotal: number|string;
  dataRegistro: Date;
  valoresIguais: boolean = true;

  constructor(private service: PagamentoService,
              private recebimentoService: TipoRecebimentoService,
              private toast: ToastrService, 
              private router: Router,
              private activatedRout: ActivatedRoute,
              private currencyPipe: CurrencyPipe,
              private pedidoService: PedidoService,
              private datePipe: DatePipe) { }

  ngOnInit(): void {
 // Recuperar IDs do localStorage
 const pedidoIdsString = localStorage.getItem('pedidoIds');
 const pedidoIds = pedidoIdsString ? JSON.parse(pedidoIdsString) : [];

 console.log('IDs recebidos do localStorage:', pedidoIds);

 if (pedidoIds.length) {
   this.processarMultiplosPedidos(pedidoIds);  
  } else {
    // Remover IDs do localStorage para evitar problemas futuros
    localStorage.removeItem('pedidoIds');
    
    const pedidoId = +this.activatedRout.snapshot.paramMap.get('id'); // Se for um único ID
    this.processarPedidoUnico(pedidoId);
  }

    this.pagamentoForm = new FormGroup({
      id:           new FormControl(null),
      pedido_fk:   new FormControl(null,Validators.required),
      valor_pagamento: new FormControl(null, Validators.required),
      tipo_recebimento_fk:  new FormControl(null, Validators.required),
      valor_total: new FormControl(null),
      data_registro_pagamento: new FormControl(null, Validators.required)
    });

  
  }

  processarPedidoUnico(pedidoId: number): void {
    this.pedidoService.findById(pedidoId).subscribe(resposta => {
      this.pagamentoForm.patchValue({
        valor_total: this.formatarMoeda(resposta.valor_total),
        data_registro_pagamento: parse(resposta.data_registro, 'dd/MM/yyyy', new Date()),
        pedido_fk: pedidoId
      });
    }, error => {
      console.error('Erro ao obter detalhes do pedido', error);
    });
  }

  processarMultiplosPedidos(pedidoIds: number[]): void {
    console.log("entrou aqui")
    this.pedidoService.findByIds(pedidoIds).subscribe(resposta => {
      this.pagamentoForm.patchValue({
        valor_total: this.formatarMoeda(resposta.valorTotal),
        data_registro_pagamento: parse(resposta.data_registro, 'dd/MM/yyyy', new Date()),
      });
    }, error => {
      console.error('Erro ao obter detalhes dos pedidos', error);
    });
  }

  findRecebimento(tipo: string, categoria: string): void {
    this.recebimentoService.comboRecebimento(tipo,categoria).pipe(
        map((data: Tipo_Recebimento[]) => data.map(item => ({
            id: item.id,
            descricao: item.conta
        })))
    ).subscribe((mappedData: { id: number, descricao: string }[]) => {
        this.tipo_Recebimento = mappedData;
    });
}

  onTipoChange(event: any): void {
    const selectedTipo = event.value;
    this.findRecebimento(selectedTipo,"RECEBIMENTO");
}

  formatarMoeda(obj: number | string){
    const formattedValorCusto = this.currencyPipe.transform(obj, 'BRL', '', '1.2-2');
    return formattedValorCusto;
}

parseMoeda(valor: string): number {
// Remove todos os pontos e substitui a vírgula por ponto
const valorNumerico = valor.replace(/\./g, '').replace(',', '.');
  return parseFloat(valorNumerico);
}

moeda(campo: string, obj: any): void {
  let value = obj.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
  value = (value / 100).toFixed(2) + ''; // Adiciona duas casas decimais
  value = value.replace('.', ','); // Substitui o ponto pela vírgula
  value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adiciona os pontos de milhar
  obj.value = value; // Atualiza o valor no campo

   // Atualiza o valor no campo do formulário
   this.pagamentoForm.get(campo)?.setValue(obj.value, { emitEvent: false });
  // Valida o formato após a atualização
  if (!this.validarMoeda(obj)) {
    // Se precisar de uma ação adicional, você pode adicionar aqui
  }
}

// Função para validar o formato da moeda
validarMoeda(control: any): { [key: string]: boolean } | null {
  const regex = /^\d{1,3}(\.\d{3})*,\d{2}$/;
  const isValid = regex.test(control.value);
  return isValid ? null : { moedaInvalida: true };
}

  save(): void {
    if (this.isEditMode) {
    } else {
      this.create();
    }
  }

  create(): void {
    const formValue = this.pagamentoForm.value;
    
   // Converte os valores formatados de volta para double
   formValue.valor_pagamento = this.parseMoeda(formValue.valor_pagamento);
   formValue.valor_total = this.parseMoeda(formValue.valor_total);
   formValue.pedido_fk = this.pedidoId;
   formValue.data_registro_pagamento = this.datePipe.transform(formValue.data_registro_pagamento, 'dd/MM/yyyy');

    this.service.create(formValue).subscribe(resposta => {
      this.toast.success('Pagamento cadastrado com sucesso');
      this.router.navigate(['pedidos']);
    },ex => {
      if(ex.error.errors){
        ex.error.errors.forEach(element => {
          this.toast.error(element.message);
        });
      }else{
        this.toast.error(ex.error.message);
      }
    })
  }

  validarPagamento(): void {
    const valorTotal = this.parseMoeda(this.pagamentoForm.get('valor_total')?.value);
    const valorPagamento = this.parseMoeda(this.pagamentoForm.get('valor_pagamento')?.value);
    this.valoresIguais = valorTotal === valorPagamento;
  }
  
  validaCampos(): boolean { 
    return this.pagamentoForm.valid
  }

  dateFilter = (date: Date | null): boolean => {
    
    if(!date){
      return true
    }
    
    this.dataRegistro = new Date(this.pagamentoForm.get('data_registro_pagamento')?.value);
  
    const day = date.getDay();
    // Desabilita finais de semana (domingo e sábado)
    const isWeekend = day === 0 || day === 6;
    
    // Verifica se a data é posterior ou igual à data do pedido
    const isAfterPedidoDate = date >= this.dataRegistro;

    // Habilita apenas dias que não sejam finais de semana e sejam após a data do pedido
    return !isWeekend && isAfterPedidoDate;
}
}


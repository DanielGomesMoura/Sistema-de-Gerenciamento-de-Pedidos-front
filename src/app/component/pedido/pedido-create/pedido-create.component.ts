import { ProdutoService } from './../../../services/produto.service';
import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PedidoService } from 'src/app/services/pedido.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { Cliente } from 'src/app/models/cliente';
import { Produto } from 'src/app/models/produto';
import { DatePipe } from '@angular/common';
import { parse } from 'date-fns';

@Component({
  selector: 'app-pedido-create',
  templateUrl: './pedido-create.component.html',
  styleUrls: ['./pedido-create.component.css']
})
export class PedidoCreateComponent implements OnInit {

  pedidoForm: FormGroup;
  isDateDisabled: boolean = true; // Inicialmente desabilitado
  isEditMode: boolean = false;
  clientes: Cliente[] = [];
  produtos: Produto[] = [];
  produtoMap: Map<number, Produto> = new Map(); //Mapeamento para acesso rápido  

  constructor(private service: PedidoService,
              private clienteService: ClienteService,
              private toast: ToastrService, 
              private router: Router,
              private activatedRout: ActivatedRoute,
              private currencyPipe: CurrencyPipe,
              private produtoService: ProdutoService,
              private datePipe: DatePipe) { }

  ngOnInit(): void {
    const dataAtual = new Date(); // Não é necessário formatar aqui
    this.pedidoForm = new FormGroup({
      id:            new FormControl(null),
      cliente_fk:    new FormControl(null,Validators.required),
      valor_total:   new FormControl(null, Validators.required),
      data_registro: new FormControl(dataAtual, Validators.required),//new FormControl(null, Validators.required), // Inicialmente desabilitado
      produto:       new FormControl(null),
      itensPedido:   new FormArray([])
    });

    const id = this.activatedRout.snapshot.paramMap.get('id');
    if(id){
      this.pedidoForm.patchValue({id});
      this.findById(id);
      this.isEditMode = true;
    }
    this.findCliente();
    this.findProduto();
    this.onChanges();
  }

  // Método para acessar o FormArray
get itensPedido(): FormArray {
  return this.pedidoForm.get('itensPedido') as FormArray;
}

  findCliente():void{
    this.clienteService.findAll().subscribe((data: Cliente[]) => {
      this.clientes = data;
    });
  }

  findProduto():void{
    this.produtoService.findAll().subscribe((data: Produto[]) => {
      this.produtos = data;
      this.produtoMap = new Map(data.map(produto => [produto.id, produto]));
    });
  }

  findById(id: string): void{
   
    this.service.findById(id).subscribe(resposta =>{
      this.pedidoForm.patchValue({
        cliente_fk: resposta.cliente_fk,
        valor_total: this.formatarMoeda(resposta.valor_total),
        data_registro: parse(resposta.data_registro, 'dd/MM/yyyy', new Date())
      });
      
       // Obtenha o FormArray de itensPedido do pedidoForm
    const itensPedidoArray = this.pedidoForm.get('itensPedido') as FormArray;

    // Limpe o FormArray existente (opcional, dependendo do seu caso de uso)
    itensPedidoArray.clear();
    // Adicione cada itemPedido ao FormArray
    resposta.itensPedido.forEach((item: any) => {
      const itemFormGroup = new FormGroup({
        id: new FormControl(item.id),
        produto_fk: new FormControl(item.produto_fk),
        descricao_produto: new FormControl(item.descricao_produto),
        quantidade: new FormControl(item.quantidade),
        valor_unitario: new FormControl(item.valor_unitario)
      });

      // Escuta as mudanças na quantidade
      const quantidadeControl = itemFormGroup.get('quantidade');
      quantidadeControl?.valueChanges.subscribe((quantidade: number) => {
        const valorUnitarioControl = itemFormGroup.get('valor_unitario');
        if (quantidade > 1) {
          valorUnitarioControl?.setValue(item.valor_promocional);
        } else {
          valorUnitarioControl?.setValue(item.valor_venda);
        }
      });

      itensPedidoArray.push(itemFormGroup);

    });
  });
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

  save(): void {
    if (this.isEditMode) {
      this.update();
    } else {
      this.create();
    }
  }

  update(): void {
    const formValue = this.pedidoForm.value;

    formValue.data_registro = this.datePipe.transform(formValue.data_registro, 'dd/MM/yyyy');
   // Converte os valores formatados de volta para double
   formValue.valor_total = this.parseMoeda(formValue.valor_total);

  // Se `itensPedido` estiver presente, garanta que seja um array válido
if (formValue.itensPedido && Array.isArray(formValue.itensPedido)) {
 formValue.itensPedido = formValue.itensPedido.map((item: any) => {
   return {
     ...item,
   };
 });
}

    this.service.update(formValue).subscribe(() => {
      this.toast.success('Produto atualizado com sucesso','Update');
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

  create(): void {
    const formValue = this.pedidoForm.value;
   // Converte os valores formatados de volta para double
   formValue.valor_total = this.parseMoeda(formValue.valor_total);
   formValue.data_registro = this.datePipe.transform(formValue.data_registro, 'dd/MM/yyyy');

     // Se `itensPedido` estiver presente, garanta que seja um array válido
  if (formValue.itensPedido && Array.isArray(formValue.itensPedido)) {
    formValue.itensPedido = formValue.itensPedido.map((item: any) => {
      return {
        ...item,
      };
    });
  }

    this.service.create(this.pedidoForm.value).subscribe(resposta => {
      this.toast.success('Pedido cadastrado com sucesso');
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
  
  validaCampos(): boolean { 
    return this.pedidoForm.valid
  }

  onProdutoChange(event: any): void {
    const produtoId = event.value;
    const produto = this.produtoMap.get(produtoId);
  if (produto) {
    const itensPedidoArray = this.pedidoForm.get('itensPedido') as FormArray;
    // Cria um novo FormGroup para o item do pedido
    const newItem = new FormGroup({
      produto_fk: new FormControl(produtoId),
      descricao_produto: new FormControl(produto.descricao),
      quantidade: new FormControl(1),
      valor_unitario: new FormControl(produto.valor_venda)
    });

    // Adiciona o novo FormGroup ao FormArray
    itensPedidoArray.push(newItem);

     // Adiciona um listener para o campo 'quantidade'
    const quantidadeControl = newItem.get('quantidade');
    quantidadeControl?.valueChanges.subscribe((quantidade: number) => {
      const valorUnitarioControl = newItem.get('valor_unitario');
      if (quantidade > 1) {
        valorUnitarioControl?.setValue(produto.valor_promocional);
      } else {
        valorUnitarioControl?.setValue(produto.valor_venda);
      }
    });
  }
}

 onChanges(): void {
    this.itensPedido.valueChanges.subscribe(() => {
      this.updateValorTotal();
    });
  }

    updateValorTotal(): void {
    const valorTotal = this.itensPedido.controls.reduce((acc, item) => {
      const quantidade = item.get('quantidade').value;
      const valorUnitario = item.get('valor_unitario').value;
      return acc + (quantidade * valorUnitario);
    }, 0);
    // Atualiza o campo valor_total no FormGroup
   this.pedidoForm.patchValue({
      valor_total: this.formatarMoeda(valorTotal),
    }); 
  }

  dateFilter(date) {
     if (!date) {
        return true; // Permite que todas as datas sejam válidas até que uma seja selecionada
    }
    const day = date.getDay();
    return day != 0 && day != 6;
}

delete(index:number): void{
  // Remova o item com base no índice
  this.itensPedido.removeAt(index);
  (index);
   
   // Verifique se todos os itens foram removidos
   if (this.itensPedido.length === 0) {
       this.pedidoForm.get('valor_total').setValue(''); // Define valor_total como vazio
       this.pedidoForm.get('produto').setValue(null);
   }
 }
}

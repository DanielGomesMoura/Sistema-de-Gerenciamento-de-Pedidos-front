import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { parse } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { Insumos } from 'src/app/models/insumos';
import { Tipo_Recebimento } from 'src/app/models/tipo-recebimento';
import { CompraService } from 'src/app/services/compra.service';
import { InsumoService } from 'src/app/services/insumo.service';
import { TipoRecebimentoService } from 'src/app/services/tipo-recebimento.service';
import { minValue } from 'src/app/util/validator';

@Component({
  selector: 'app-compra-create',
  templateUrl: './compra-create.component.html',
  styleUrl: './compra-create.component.css'
})
export class CompraCreateComponent {

    compraForm: FormGroup;
    isDateDisabled: boolean = true; // Inicialmente desabilitado
    isEditMode: boolean = false;
    tipoRecebimento: Tipo_Recebimento[] = [];
    insumo: Insumos[] = [];
    insumoMap: Map<number, Insumos> = new Map(); //Mapeamento para acesso rápido  
  
    constructor(private service: CompraService,
                private recebimentoService: TipoRecebimentoService,
                private toast: ToastrService, 
                private router: Router,
                private activatedRout: ActivatedRoute,
                private currencyPipe: CurrencyPipe,
                private insumoService: InsumoService,
                private datePipe: DatePipe) { }
  
    ngOnInit(): void {
      const dataAtual = new Date(); // Não é necessário formatar aqui
      this.compraForm = new FormGroup({
        id:            new FormControl(null),
        fornecedor:    new FormControl(null,Validators.required),
        tipo_recebimento_fk:    new FormControl(null),
        valor_total:   new FormControl(null, [Validators.required,minValue(0.01)]),
        data_registro: new FormControl(dataAtual, Validators.required),//new FormControl(null, Validators.required), // Inicialmente desabilitado
        insumo:        new FormControl(null),
        itensCompra:   new FormArray([])
      });
  
      const id = this.activatedRout.snapshot.paramMap.get('id');
      if(id){
        this.compraForm.patchValue({id});
        this.findById(id);
        this.isEditMode = true;
      }
      //this.findTipoRecebimento();
      this.findInsumo();
      this.onChanges();
    }
  
    // Método para acessar o FormArray
  get itensCompra(): FormArray {
    return this.compraForm.get('itensCompra') as FormArray;
  }

  onChanges(): void {
    this.itensCompra.valueChanges.subscribe(() => {
      this.updateValorTotal();
    });
  }
  
   // findTipoRecebimento():void{
   //   this.clienteService.findAll().subscribe((data: Cliente[]) => {
   //     this.clientes = data;
   //   });
   // }
  
    findInsumo():void{
      this.insumoService.findAll().subscribe((data: Insumos[]) => {
        this.insumo = data;
        this.insumoMap = new Map(data.map(insumo => [insumo.id, insumo]));
      });
    }
  
    findById(id: string): void{
     
      this.service.findById(id).subscribe(resposta =>{
        this.compraForm.patchValue({
          tipo_recebimento_fk: resposta.tipo_recebimento_fk,
          valor_total: this.formatarMoeda(resposta.valor_total),
          fornecedor: resposta.fornecedor,
          data_registro: parse(resposta.data_registro, 'dd/MM/yyyy', new Date())
        });
        
         // Obtenha o FormArray de itensPedido do pedidoForm
      const itensCompraArray = this.compraForm.get('itensCompra') as FormArray;
  
      // Limpe o FormArray existente (opcional, dependendo do seu caso de uso)
      itensCompraArray.clear();
      // Adicione cada itemPedido ao FormArray
      resposta.itensCompra.forEach((item: any) => {
        const itemFormGroup = new FormGroup({
          id: new FormControl(item.id),
          insumo_fk: new FormControl(item.insumo_fk),
          descricao_insumo: new FormControl(item.descricao_insumo),
          quantidade: new FormControl(item.quantidade),
          valor_unitario: new FormControl(item.valor_unitario)
        });
        itensCompraArray.push(itemFormGroup);
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
      const formValue = this.compraForm.value;
  
      formValue.data_registro = this.datePipe.transform(formValue.data_registro, 'dd/MM/yyyy');
     // Converte os valores formatados de volta para double
     formValue.valor_total = this.parseMoeda(formValue.valor_total);
    // Se `itensPedido` estiver presente, garanta que seja um array válido
  if (formValue.itensCompra && Array.isArray(formValue.itensCompra)) {
   formValue.itensCompra = formValue.itensCompra.map((item: any) => {
    console.log('entrou aqui')
     // Verifica e ajusta o valor unitário se ele tiver três zeros após o ponto
     const valorUnitarioStr = item.valor_unitario.toString();
     if (valorUnitarioStr.includes('.') && valorUnitarioStr.split('.')[1]?.length === 3) {
       item.valor_unitario *= 10;
     }
     item.valor_unitario = item.valor_unitario.toString(); // Converte o valor unitário para número
     return {
       ...item,
     };
   });
  }
  
      this.service.update(formValue).subscribe(() => {
        this.toast.success('Compra atualizada com sucesso','Update');
        this.router.navigate(['compras']);
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
      const formValue = this.compraForm.value;
     // Converte os valores formatados de volta para double
     formValue.valor_total = this.parseMoeda(formValue.valor_total);
     formValue.data_registro = this.datePipe.transform(formValue.data_registro, 'dd/MM/yyyy');
  
       // Se `itensPedido` estiver presente, garanta que seja um array válido
    if (formValue.itensCompra && Array.isArray(formValue.itensCompra)) {
      formValue.itensCompra = formValue.itensCompra.map((item: any) => {
        return {
          ...item,
        };
      });
    }
  
      this.service.create(this.compraForm.value).subscribe(resposta => {
        this.toast.success('Compra cadastrada com sucesso');
        this.router.navigate(['compras']);
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
      return this.compraForm.valid
    }
  
    onProdutoChange(event: any): void {
      const insumoid = event.value;
      const insumo = this.insumoMap.get(insumoid);
    if (insumo) {
      const itensPedidoArray = this.compraForm.get('itensCompra') as FormArray;
      // Cria um novo FormGroup para o item do pedido
      const newItem = new FormGroup({
        insumo_fk: new FormControl(insumoid),
        descricao_insumo: new FormControl(insumo.descricao),
        quantidade: new FormControl(1),
        valor_unitario: new FormControl(0.00,[Validators.required,Validators.min(0.01)])
      });
  
      // Adiciona o novo FormGroup ao FormArray
      itensPedidoArray.push(newItem);
    }
  }
  
  updateValorTotal(): void {
    const valorTotal = this.itensCompra.controls.reduce((acc, item) => {
      // Parse os valores para garantir que são números
      const quantidade = item.get('quantidade').value;
      let valorUnitario = item.get('valor_unitario').value
     // Verifica e ajusta o valor unitário se ele tiver três zeros após o ponto
     const valorUnitarioStr = valorUnitario.toString();
     if (valorUnitarioStr.includes('.') && valorUnitarioStr.split('.')[1].length === 3) {
       valorUnitario *= 10;
     }
      
      return acc + (quantidade * valorUnitario);
    }, 0);
    // Corrigir os três zeros após o ponto
  const valorTotalCorrigido = valorTotal.toFixed(2);

  // Atualiza o campo valor_total no FormGroup
  this.compraForm.patchValue({
    valor_total: this.formatarMoeda(valorTotalCorrigido),
  }, { emitEvent: false });
  }
  
  selecionarTexto(inputElement: HTMLInputElement): void {
    inputElement.select();
  }

  delete(index:number): void{
    // Remova o item com base no índice
    this.itensCompra.removeAt(index);
    (index);
     
     // Verifique se todos os itens foram removidos
     if (this.itensCompra.length === 0) {
         this.compraForm.get('valor_total').setValue(''); // Define valor_total como vazio
         this.compraForm.get('insumo').setValue(null);
     }
   }

   moeda(campo: string, obj: any): void {
    let value = obj.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    value = ((value) / 100).toFixed(2); // Adiciona duas casas decimais
    //value = value.replace('.', ','); // Substitui o ponto pela vírgula
    //value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ''); // Adiciona os pontos de milhar
    obj.value = value; // Atualiza o valor no campo
   console.log(obj.value)
     // Atualiza o valor no campo do formulário
     this.compraForm.get(campo)?.setValue(obj.value, { emitEvent: false });
  }
}

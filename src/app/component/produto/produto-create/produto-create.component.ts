import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProdutoService } from 'src/app/services/produto.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-produto-create',
  templateUrl: './produto-create.component.html',
  styleUrls: ['./produto-create.component.css']
})
export class ProdutoCreateComponent implements OnInit {

  produtoForm: FormGroup;

  isEditMode: boolean = false;

  constructor(private service: ProdutoService,
              private toast: ToastrService, 
              private router: Router,
              private activatedRout: ActivatedRoute,
              private currencyPipe: CurrencyPipe ) { }

  ngOnInit(): void {
    this.produtoForm = new FormGroup({
      id:          new FormControl(null),
      descricao:   new FormControl(null,Validators.minLength(3)),
      unidade:     new FormControl(null, Validators.required),
      valor_custo: new FormControl(null, Validators.required),
      valor_venda: new FormControl(null, Validators.required),
      valor_promocional: new FormControl(null, Validators.required)
    })

    const id = this.activatedRout.snapshot.paramMap.get('id');
    if(id){
      this.produtoForm.patchValue({id});
      this.findById(id);
      this.isEditMode = true;
    }
  }

  findById(id: string): void{
    this.service.findById(id).subscribe(resposta =>{
      this.produtoForm.patchValue({
        descricao: resposta.descricao,
        unidade: resposta.unidade,
        valor_custo: this.formatarMoeda(resposta.valor_custo),
        valor_venda: this.formatarMoeda(resposta.valor_venda),
        valor_promocional: this.formatarMoeda(resposta.valor_promocional)
      });
    })
  }

  formatarMoeda(obj: number | string){
    const formattedValorCusto = this.currencyPipe.transform(obj, 'BRL', '', '1.2-2');
    return formattedValorCusto;
}

// Função para validar o formato da moeda
validarMoeda(control: any): { [key: string]: boolean } | null {
  const regex = /^\d{1,3}(\.\d{3})*,\d{2}$/;
  const isValid = regex.test(control.value);
  return isValid ? null : { moedaInvalida: true };
}

moeda(campo: string, obj: any): void {
  let value = obj.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
  value = (value / 100).toFixed(2) + ''; // Adiciona duas casas decimais
  value = value.replace('.', ','); // Substitui o ponto pela vírgula
  value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adiciona os pontos de milhar
  obj.value = value; // Atualiza o valor no campo

   // Atualiza o valor no campo do formulário
   this.produtoForm.get(campo)?.setValue(obj.value, { emitEvent: false });
  // Valida o formato após a atualização
  if (!this.validarMoeda(obj)) {
    // Se precisar de uma ação adicional, você pode adicionar aqui
  }
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
    const formValue = this.produtoForm.value;
    // Converte os valores formatados de volta para double
    formValue.valor_custo = this.parseMoeda(formValue.valor_custo);
    formValue.valor_venda = this.parseMoeda(formValue.valor_venda);
    formValue.valor_promocional = this.parseMoeda(formValue.valor_promocional);
    formValue.descricao = formValue.descricao.toUpperCase();

    this.service.update(formValue).subscribe(() => {
      this.toast.success('Produto atualizado com sucesso','ATUALIZADO');
      this.router.navigate(['produtos']);
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
    const formValue = this.produtoForm.value;
    formValue.valor_custo = this.parseMoeda(formValue.valor_custo);
    formValue.valor_venda = this.parseMoeda(formValue.valor_venda);
    formValue.valor_promocional = this.parseMoeda(formValue.valor_promocional);
    formValue.descricao = formValue.descricao.toUpperCase();

    this.service.create(formValue).subscribe(resposta => {
      this.toast.success('Produto cadastrado com sucesso','CADASTRADO');
      this.router.navigate(['produtos']);
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
    return this.produtoForm.valid
  }
}

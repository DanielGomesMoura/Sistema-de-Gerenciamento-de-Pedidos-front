import { Conta } from './../../models/conta';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ContaService } from 'src/app/services/conta.service';
import { TipoRecebimentoService } from 'src/app/services/tipo-recebimento.service';

@Component({
  selector: 'app-tipo-recebimento-create',
  templateUrl: './tipo-recebimento-create.component.html',
  styleUrls: ['./tipo-recebimento-create.component.css']
})
export class TipoRecebimentoCreateComponent implements OnInit {

 tipo_recebimentoForm: FormGroup;
 conta: Conta[] = [];

  isEditMode: boolean = false;

  constructor(private service: TipoRecebimentoService,
              private contaService: ContaService,
              private toast: ToastrService, 
              private router: Router,
              private activatedRout: ActivatedRoute) { }

  ngOnInit(): void {
    // Inicializando o FormGroup com os FormControl correspondentes
    this.tipo_recebimentoForm = new FormGroup({
      id: new FormControl(null),
      conta_fk:   new FormControl(null,Validators.required),
      tipo: new FormControl(null,Validators.required),
      categoria: new FormControl(null,Validators.required)
    });

    // Verifica se está no modo de edição
    const id = this.activatedRout.snapshot.paramMap.get('id');
    if (id) {
      this.tipo_recebimentoForm.patchValue({id});
      this.findById(id);
      this.isEditMode = true;
    }
    this.findConta();
  }

  findConta():void{
    this.contaService.findAll().subscribe((data: Conta[]) => {
      this.conta = data;
    });
  }

  findById(id: string): void{
    this.service.findById(id).subscribe(resposta =>{
      this.tipo_recebimentoForm.patchValue({
       tipo: resposta.tipo,
       conta_fk: resposta.conta_fk,
       categoria: resposta.categoria
      });
    })
  }

  save(): void {
    if (this.isEditMode) {
      this.update();
    } else {
      this.create();
    }
  }

  update(): void {
    const formValue = this.tipo_recebimentoForm.value;

    this.service.update(this.tipo_recebimentoForm.value).subscribe(() => {
      this.toast.success('Tipo de Recebimentos atualizado com sucesso','Update');
      this.router.navigate(['recebimentos']);
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
    const formValue = this.tipo_recebimentoForm.value;
    
    this.service.create(this.tipo_recebimentoForm.value).subscribe(resposta => {
      this.toast.success('Tipo de Recebimento cadastrado com sucesso');
      this.router.navigate(['recebimentos']);
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
    return this.tipo_recebimentoForm.valid;
  }
}

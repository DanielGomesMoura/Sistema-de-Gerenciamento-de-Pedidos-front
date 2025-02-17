import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InsumoService } from 'src/app/services/insumo.service';

@Component({
  selector: 'app-insumo-create',
  templateUrl: './insumo-create.component.html',
  styleUrl: './insumo-create.component.css'
})
export class InsumoCreateComponent {

  insumoForm: FormGroup;
  
    isEditMode: boolean = false;
  
    constructor(private service: InsumoService,
                private toast: ToastrService, 
                private router: Router,
                private activatedRout: ActivatedRoute) { }
  
    ngOnInit(): void {
      // Inicializando o FormGroup com os FormControl correspondentes
      this.insumoForm = new FormGroup({
        id: new FormControl(null),
        descricao: new FormControl(null, [Validators.required, Validators.minLength(3)])
      });
  
      // Verifica se está no modo de edição
      const id = this.activatedRout.snapshot.paramMap.get('id');
      if (id) {
        this.insumoForm.patchValue({id});
        this.findById(id);
        this.isEditMode = true;
      }
    }
  
    findById(id: string): void{
      this.service.findById(id).subscribe(resposta =>{
        this.insumoForm.patchValue({
          descricao: resposta.descricao
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
      const formValue = this.insumoForm.value;
  
      formValue.descricao = formValue.descricao.toUpperCase();
  
      this.service.update(this.insumoForm.value).subscribe(() => {
        this.toast.success('Insumo atualizado com sucesso','ATUALIZADO');
        this.router.navigate(['insumos']);
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
      const formValue = this.insumoForm.value;
  
      formValue.descricao = formValue.descricao.toUpperCase();
      
      this.service.create(this.insumoForm.value).subscribe(resposta => {
        this.toast.success('Cliente cadastrado com sucesso','CADASTRADO');
        this.router.navigate(['insumos']);
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
      return this.insumoForm.valid;
    }
}

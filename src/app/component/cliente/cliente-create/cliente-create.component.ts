import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-cliente-create',
  templateUrl: './cliente-create.component.html',
  styleUrls: ['./cliente-create.component.css']
})
export class ClienteCreateComponent implements OnInit {

  clienteForm: FormGroup;

  isEditMode: boolean = false;

  constructor(private service: ClienteService,
              private toast: ToastrService, 
              private router: Router,
              private activatedRout: ActivatedRoute) { }

  ngOnInit(): void {
    // Inicializando o FormGroup com os FormControl correspondentes
    this.clienteForm = new FormGroup({
      id: new FormControl(null),
      nome: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      email: new FormControl(null, [Validators.required, Validators.email])
    });

    // Verifica se está no modo de edição
    const id = this.activatedRout.snapshot.paramMap.get('id');
    if (id) {
      this.clienteForm.patchValue({id});
      this.findById(id);
      this.isEditMode = true;
    }
  }

  findById(id: string): void{
    this.service.findById(id).subscribe(resposta =>{
      this.clienteForm.patchValue({
        nome: resposta.nome,
        email: resposta.email
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
    const formValue = this.clienteForm.value;

    formValue.nome = formValue.nome.toUpperCase();

    this.service.update(this.clienteForm.value).subscribe(() => {
      this.toast.success('Cliente atualizado com sucesso','ATUALIZADO');
      this.router.navigate(['clientes']);
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
    const formValue = this.clienteForm.value;

    formValue.nome = formValue.nome.toUpperCase();
    
    this.service.create(this.clienteForm.value).subscribe(resposta => {
      this.toast.success('Cliente cadastrado com sucesso','CADASTRADO');
      this.router.navigate(['clientes']);
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
    return this.clienteForm.valid;
  }
}

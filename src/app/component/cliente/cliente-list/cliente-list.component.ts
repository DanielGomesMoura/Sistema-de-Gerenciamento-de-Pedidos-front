import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog-component';
//import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.css']
})
export class ClienteListComponent implements OnInit {

  ELEMENT_DATA: Cliente[] = []

  cliente: Cliente = {
    id: '',
    nome: '',
    email: ''
  }

  displayedColumns: string[] = ['id', 'nome', 'email','acoes'];
  dataSource = new MatTableDataSource<Cliente>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private service: ClienteService,
              private toast: ToastrService,
              private dialog: MatDialog
             ) { }

  ngOnInit(): void {
    this.findAll();
  }

  findById(): void{
    this.service.findById(this.cliente.id).subscribe(resposta =>{
      this.cliente = resposta
    })
  }

  findAll(){
    this.service.findAll().subscribe(resposta => {
    this.ELEMENT_DATA = resposta 
    this.dataSource = new MatTableDataSource<Cliente>(resposta);
    this.dataSource.paginator = this.paginator;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  delete(cliente: Cliente): void{
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: "Tem certeza que deseja remover esse Cliente?",
    });
    dialogRef.afterClosed().subscribe( (resposta: boolean)=>{
      if(resposta){
        this.service.delete(cliente.id).subscribe(() =>{
          this.toast.success('Cliente Deletado com sucesso','Delete');
          this.toast.success('Cliente Deletado com sucesso','REMOVIDO')
          this.findAll();
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
    })
  }
}
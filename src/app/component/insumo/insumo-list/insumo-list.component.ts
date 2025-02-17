import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Insumos } from 'src/app/models/insumos';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog-component';
import { InsumoService } from 'src/app/services/insumo.service';

@Component({
  selector: 'app-insumo-list',
  templateUrl: './insumo-list.component.html',
  styleUrl: './insumo-list.component.css'
})
export class InsumoListComponent {

  ELEMENT_DATA: Insumos[] = []
  
    insumos: Insumos = {
      id: '',
      descricao: ''
    }
  
    displayedColumns: string[] = ['id', 'descricao', 'acoes'];
    dataSource = new MatTableDataSource<Insumos>(this.ELEMENT_DATA);
  
    @ViewChild(MatPaginator) paginator: MatPaginator;
  
    constructor(private service: InsumoService,
                private toast: ToastrService,
                private dialog: MatDialog
               ) { }
  
    ngOnInit(): void {
      this.findAll();
    }
  
    findById(): void{
      this.service.findById(this.insumos.id).subscribe(resposta =>{
        this.insumos = resposta
      })
    }
  
    findAll(){
      this.service.findAll().subscribe(resposta => {
      this.ELEMENT_DATA = resposta 
      this.dataSource = new MatTableDataSource<Insumos>(resposta);
      this.dataSource.paginator = this.paginator;
      })
    }
  
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  
    delete(insumos: Insumos): void{
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: "Tem certeza que deseja remover esse Insumo?",
      });
      dialogRef.afterClosed().subscribe( (resposta: boolean)=>{
        if(resposta){
          this.service.delete(insumos.id).subscribe(() =>{
           this.toast.success('Insumo Deletado com sucesso','REMOVIDO')
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

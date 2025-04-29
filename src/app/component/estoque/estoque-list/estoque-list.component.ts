import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Estoque } from 'src/app/models/estoque';
import { EstoqueService } from 'src/app/services/estoque.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog-component';

@Component({
  selector: 'app-estoque-list',
  templateUrl: './estoque-list.component.html',
  styleUrl: './estoque-list.component.css'
})
export class EstoqueListComponent {

    ELEMENT_DATA: Estoque[] = []
    
      estoque: Estoque = {
        id: '',
        descricao: '',
        quantidadeAtual: null,
        valorUnitario: null,
        tipo: null,
        motivo: null,
        data_registro: null,
        insumo_fk: null
      }
    
      displayedColumns: string[] = ['id', 'descricao','quantidade','valor_unitario','data_registro','tipo','motivo', 'acoes'];
      dataSource = new MatTableDataSource<Estoque>(this.ELEMENT_DATA);
    
      @ViewChild(MatPaginator) paginator: MatPaginator;
    
      constructor(private service: EstoqueService,
                  private toast: ToastrService,
                  private dialog: MatDialog
                 ) { }
    
      ngOnInit(): void {
        this.findAll();
      }
    
      findById(): void{
        this.service.findById(this.estoque.id).subscribe(resposta =>{
          this.estoque = resposta
        })
      }
    
      findAll(){
        this.service.findAll().subscribe(resposta => {
        this.ELEMENT_DATA = resposta 
        this.dataSource = new MatTableDataSource<Estoque>(resposta);
        this.dataSource.paginator = this.paginator;
        })
      }
    
      applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
      }
    
      delete(estoque: Estoque): void{
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: "Tem certeza que deseja remover esse Insumo?",
        });
        dialogRef.afterClosed().subscribe( (resposta: boolean)=>{
          if(resposta){
            this.service.delete(estoque.id).subscribe(() =>{
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

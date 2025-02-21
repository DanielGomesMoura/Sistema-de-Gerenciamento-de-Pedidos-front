import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog as MatDialog } from '@angular/material/dialog';
import { MatPaginator as MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource as MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Tipo_Recebimento } from 'src/app/models/tipo-recebimento';
import { TipoRecebimentoService } from 'src/app/services/tipo-recebimento.service';

@Component({
  selector: 'app-tipo-recebimento-list',
  templateUrl: './tipo-recebimento-list.component.html',
  styleUrls: ['./tipo-recebimento-list.component.css']
})
export class TipoRecebimentoListComponent implements OnInit {

  ELEMENT_DATA: Tipo_Recebimento[] = []

  tipo_recebimento: Tipo_Recebimento = {
    id: '',
    conta: '',
    tipo: '',
    conta_fk: null,
    categoria:'',
  }

  displayedColumns: string[] = ['id', 'conta', 'tipo', 'categoria', 'acoes'];
  dataSource = new MatTableDataSource<Tipo_Recebimento>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private service: TipoRecebimentoService,
              private toast: ToastrService,
              private dialog: MatDialog
             ) { }

  ngOnInit(): void {
    this.findAll();
  }

  findById(): void{
    this.service.findById(this.tipo_recebimento.id).subscribe(resposta =>{
      this.tipo_recebimento = resposta
    })
  }

  findAll(){
    this.service.findAll().subscribe(resposta => {
    this.ELEMENT_DATA = resposta 
    this.dataSource = new MatTableDataSource<Tipo_Recebimento>(resposta);
    this.dataSource.paginator = this.paginator;
    })
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}


import { animate, state, style, transition, trigger } from '@angular/animations';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Compra } from 'src/app/models/compra';
import { CompraService } from 'src/app/services/compra.service';

@Component({
  selector: 'app-compra-list',
  templateUrl: './compra-list.component.html',
  styleUrl: './compra-list.component.css',
   animations: [
      trigger('detailExpand', [
        state('collapsed,void', style({height: '0px', minHeight: '0'})),
        state('expanded', style({height: '*'})),
        transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      ]),
    ],
})
export class CompraListComponent implements OnInit{

  ELEMENT_DATA: Compra[] = []
     // Supondo que a data de hoje seja obtida assim
   dataInicio = null;
   dataFinal  = null;
   filterValue =  '';
  
    compra: Compra = {
      id: '',
      fornecedor: '',
      data_registro: '',
      valor_total: 0,
      nota_fiscal: '',
      tipo_recebimento_fk: null,
      conta: '',
      forma_pagamento: '',
    }
  
    dataSource = new MatTableDataSource<Compra>(this.ELEMENT_DATA);
    displayedColumns: string[] = ['id', 'fornecedor', 'data_registro', 'conta', 'forma_pagamento', 'valor_total', 'acoes'];
    columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
    expandedElement: Compra | null;
  
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
  
     ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  
    constructor(private service: CompraService,
                private toast: ToastrService,
                private dialog: MatDialog,
                private router: Router,
                private datePipe: DatePipe,
                private _liveAnnouncer: LiveAnnouncer
               ) { }
  
   announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction === 'asc' ? 'ascending' : 'descending'}`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  
    ngOnInit(): void {
      this.loadFilters();
      this.findAll(this.dataInicio,this.dataFinal);
    }
  
    loadFilters(): void {
      const savedDataInicio = localStorage.getItem('filtroDataInicio');
      const savedDataFinal = localStorage.getItem('filtroDataFinal');
  
      this.dataInicio = savedDataInicio ? this.parseDate(savedDataInicio) : new Date();
      this.dataFinal = savedDataFinal ? this.parseDate(savedDataFinal) : new Date();
       // Recupera o filtro de nome do localStorage
      this.filterValue = localStorage.getItem('filtroNome') || '';
  
       // Aplica o filtro de nome, se houver
       if (this.filterValue) {
        this.applyFilterByName(this.filterValue);
      }
    }
  
    private parseDate(dateString: string): Date {
      const [day, month, year] = dateString.split('/').map(Number);
      return new Date(year, month - 1, day); // Mês em `Date` começa em 0
    }
  
    saveFilters(): void {
       // Converte as datas para string no formato ISO antes de salvar
       const formattedDataInicio = this.datePipe.transform(this.dataInicio, 'dd/MM/yyyy');
       const formattedDataFinal = this.datePipe.transform(this.dataFinal, 'dd/MM/yyyy');   
  
    if (formattedDataInicio) {
      localStorage.setItem('filtroDataInicio', formattedDataInicio);
    }
    if (formattedDataFinal) {
      localStorage.setItem('filtroDataFinal', formattedDataFinal);
    }
      localStorage.setItem('filtroNome', this.filterValue);
    }
  
    
    findById(): void{
      this.service.findById(this.compra.id).subscribe(resposta =>{
        this.compra = resposta
      })
    }
  
    findAll(dataInicio: Date, dataFinal: Date){
      this.saveFilters();
       var datafiltroInicial = this.datePipe.transform(dataInicio, 'dd/MM/yyyy');
       var datafiltroFinal = this.datePipe.transform(dataFinal, 'dd/MM/yyyy');
       this.service.findAll(datafiltroInicial,datafiltroFinal).subscribe(resposta => {
      
     const formatarResposta = resposta.map((compra: Compra) =>{
        return{
        ...compra,
        valor_total: compra.valor_total
        };
      });
      
      this.ELEMENT_DATA = formatarResposta 
      this.dataSource.data = this.ELEMENT_DATA;
      })
    }
  
    applyFilter(event: Event) {
      localStorage.setItem('filtroNome', this.filterValue);
      this.filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = this.filterValue.trim().toLowerCase();
    }
  
     // Método para aplicar o filtro de nome
     applyFilterByName(filterValue: string): void {
      this.filterValue = filterValue.trim().toLowerCase();
      this.dataSource.filter = this.filterValue;
  
      // Salva o filtro no localStorage
      localStorage.setItem('filtroNome', this.filterValue);
    }
  }

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog as MatDialog } from '@angular/material/dialog';
import { MatPaginator as MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource as MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Pedido } from 'src/app/models/pedido';
import { PedidoService } from 'src/app/services/pedido.service';
import { Router } from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { DatePipe } from '@angular/common';
import {MatSort, Sort} from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-pedido-list',
  templateUrl: './pedido-list.component.html',
  styleUrls: ['./pedido-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PedidoListComponent implements OnInit {

  ELEMENT_DATA: Pedido[] = []
   // Supondo que a data de hoje seja obtida assim
 dataInicio = null;
 dataFinal  = null;
 situacao = "TODOS";
 filterValue =  '';
 relatorio = "relatorio_pedidos_abertos_por_clientes";

  pedido: Pedido = {
    id: '',
    data_registro: '',
    valor_total: 0,
    cliente_fk: null,
    status: '',
    nomeCliente: ''
  }

  dataSource = new MatTableDataSource<Pedido>(this.ELEMENT_DATA);
  displayedColumns: string[] = ['id', 'cliente', 'data_registro', 'valor_total', 'status', 'acoes'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: Pedido | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

   ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  constructor(private service: PedidoService,
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
    this.findAll(this.dataInicio,this.dataFinal, this.situacao);
  }

  loadFilters(): void {
    const savedDataInicio = localStorage.getItem('filtroDataInicio');
    const savedDataFinal = localStorage.getItem('filtroDataFinal');

    this.dataInicio = savedDataInicio ? this.parseDate(savedDataInicio) : new Date();
    this.dataFinal = savedDataFinal ? this.parseDate(savedDataFinal) : new Date();
     // Recupera o filtro de nome do localStorage
    this.filterValue = localStorage.getItem('filtroNome') || '';

    this.situacao = localStorage.getItem('filtroSituacao')

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
    localStorage.setItem('filtroSituacao',this.situacao);
  }

  
  findById(): void{
    this.service.findById(this.pedido.id).subscribe(resposta =>{
      this.pedido = resposta
    })
  }

  redirectToPagamentos(elementId: number) {
  this.router.navigate(['/pagamentos', elementId]);
}

imprimirRelatorio(){
  this.service.imprimeRelatorio(this.relatorio).subscribe(response => {
    const url = window.URL.createObjectURL(response);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio.pdf';
    a.click();
    window.URL.revokeObjectURL(url);
  });
}

  findAll(dataInicio: Date, dataFinal: Date, situacao: string){
    this.saveFilters();
     var datafiltroInicial = this.datePipe.transform(dataInicio, 'dd/MM/yyyy');
     var datafiltroFinal = this.datePipe.transform(dataFinal, 'dd/MM/yyyy');
     var situacaofiltro = situacao 
     this.service.findAll(datafiltroInicial,datafiltroFinal,situacaofiltro).subscribe(resposta => {
    
   const formatarResposta = resposta.map((pedido: Pedido) =>{
      return{
      ...pedido,
      valor_total: pedido.valor_total
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

 // Método para verificar se o botão deve ser desabilitado
  isButtonDisabled(dataRegistro: string): boolean {
    // Comparação para desabilitar o botão se a data de hoje for diferente de dataRegistro
    return Date() !== dataRegistro;
  }

    
  dateFilter(date: Date | null): boolean {
    if (!date) {
       return true; // Permite que todas as datas sejam válidas até que uma seja selecionada
   }
   const day = date.getDay();
   return day != 0 && day != 6;
}

  /** Gets the total cost of all transactions. */ 
  getTotalCost() {
    return this.dataSource.filteredData
    .map(t => t.valor_total)
    .reduce((acc, value) => acc + value, 0);
  }

  getTotalItens(): number {
    return this.dataSource.filteredData.reduce((total, pedido) => {
      const itensTotal = pedido.itensPedido.reduce((subtotal, item) => subtotal + item.quantidade, 0);
      return total + itensTotal;
    }, 0);
  }
}

import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RelatorioService } from 'src/app/services/relatorio.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

   relatorio = "relatorio_pedidos_abertos_por_clientes";

  constructor(private router: Router,private service: RelatorioService, private authService: AuthService, private toast: ToastrService) { }

  ngOnInit(): void {
    this.router.navigate(['home'])
  }

  //Metodo para exibir o relatório em uma nova aba
imprimirRelatorio(nomeRelatorio: string) {
  this.service.imprimeRelatorio(nomeRelatorio).subscribe(response => {
    const blob = new Blob([response], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => window.URL.revokeObjectURL(url), 100);
  });
}

  logout(){
    this.router.navigate(['login'])
    this.authService.logout();
    this.toast.info('Logout realizado com sucesso', 'Logout',{timeOut: 5000})
  }
}

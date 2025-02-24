import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CurrencyPipe } from '@angular/common';


// PARA TRABALHAR COM FORMULARIOS NO ANGULAR 12
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
//PARA REALIZAR REQUISIÇÕES HTTP
import {HttpClientModule} from "@angular/common/http";
// IMPORTS PARA OS COMPONENTES DO ANGULAR MATERIAL
import {MatFormFieldModule} from "@angular/material/form-field";
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from './util/CustomMatPaginatorIntl';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatToolbarModule} from "@angular/material/toolbar";
import { ToastrModule } from 'ngx-toastr';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatButtonModule} from "@angular/material/button";
import {MatSelectModule} from "@angular/material/select";
import {MatTableModule} from "@angular/material/table";
import {MatRadioModule} from "@angular/material/radio";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatCardModule} from "@angular/material/card";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { DatePipe } from '@angular/common';
import {registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import {MatSortModule} from '@angular/material/sort';

//Componentes do Projeto
import { NavComponent } from './component/nav/nav.component';
import { HeaderComponent } from './component/header/header.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HomeComponent } from './component/home/home.component';
import { ClienteListComponent } from './component/cliente/cliente-list/cliente-list.component';
import { ClienteCreateComponent } from './component/cliente/cliente-create/cliente-create.component';
import { ProdutoListComponent } from './component/produto/produto-list/produto-list.component';
import { ProdutoCreateComponent } from './component/produto/produto-create/produto-create.component';
import { AuthInterceptorProvider } from './interceptors/auth.interceptor';
import { NgxMaskModule } from 'ngx-mask';
import { PedidoListComponent } from './component/pedido/pedido-list/pedido-list.component';
import { PedidoCreateComponent } from './component/pedido/pedido-create/pedido-create.component';
import { PagamentoCreateComponent } from './component/pagamento/pagamento-create/pagamento-create.component';
import { LoginComponent } from './component/login/login.component';
import { RankComponent } from './component/rank/rank.component';
import { ContaListComponent } from './component/conta/conta-list/conta-list.component';
import { ContaCreateComponent } from './component/conta/conta-create/conta-create.component';
import { TipoRecebimentoListComponent } from './component/tipo-recebimento-list/tipo-recebimento-list.component';
import { TipoRecebimentoCreateComponent } from './component/tipo-recebimento-create/tipo-recebimento-create.component';
import { MovimentoCaixaListComponent } from './component/movimento-caixa/movimento-caixa-list/movimento-caixa-list.component';
import { ConfirmDialogComponent } from './component/confirm-dialog/confirm-dialog-component';
import { InsumoListComponent } from './component/insumo/insumo-list/insumo-list.component';
import { InsumoCreateComponent } from './component/insumo/insumo-create/insumo-create.component';
import { CompraListComponent } from './component/compra/compra-list/compra-list.component';
import { CompraCreateComponent } from './component/compra/compra-create/compra-create.component';

registerLocaleData(localePt, 'pt-BR');

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HeaderComponent,
    HomeComponent,
    ClienteListComponent,
    ClienteCreateComponent,
    ProdutoListComponent,
    ProdutoCreateComponent,
    PedidoListComponent,
    PedidoCreateComponent,
    PagamentoCreateComponent,
    LoginComponent,
    RankComponent,
    ContaListComponent,
    ContaCreateComponent,
    TipoRecebimentoListComponent,
    TipoRecebimentoCreateComponent,
    MovimentoCaixaListComponent,
    ConfirmDialogComponent,
    InsumoListComponent,
    InsumoCreateComponent,
    CompraListComponent,
    CompraCreateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatRadioModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatDialogModule,
    MatSortModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      closeButton: true,
      progressBar: true
    }),
    NgxMaskModule.forRoot()
  ],
  providers: [
    CurrencyPipe,
    DatePipe,
    AuthInterceptorProvider,
    provideNativeDateAdapter(),
    {provide: LOCALE_ID, useValue: 'pt-BR'},
    {provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

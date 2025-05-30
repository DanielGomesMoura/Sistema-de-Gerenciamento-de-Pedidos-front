 import { Pedido } from '../models/pedido';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api.config';
import { Observable } from 'rxjs';

 @Injectable({
   providedIn: 'root'
 })
 
 export class RelatorioService {

    constructor(private http: HttpClient) { }
    
 imprimeRelatorio(relatorio: any) {
    return this.http.get(`${API_CONFIG.baseurl}/relatorio/${relatorio}`,{ responseType: 'blob' });
  }
}
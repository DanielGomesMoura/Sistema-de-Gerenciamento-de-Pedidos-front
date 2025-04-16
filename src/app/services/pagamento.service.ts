import { Pagamento } from '../models/pagamento';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api.config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {

  constructor(private http: HttpClient) { }

  findById(id: any): Observable<Pagamento>{
    return this.http.get<Pagamento>(`${API_CONFIG.baseurl}/pagamentos/${id}`);
  }

  findAll(): Observable<Pagamento[]>{
    return this.http.get<Pagamento[]>(`${API_CONFIG.baseurl}/pagamentos`);
  }

  create(pagamento: Pagamento): Observable<Pagamento>{
    return this.http.post<Pagamento>(`${API_CONFIG.baseurl}/pagamentos`,pagamento)
  }

  createPagamentoLote(pagamento: Pagamento): Observable<Pagamento>{
    return this.http.post<Pagamento>(`${API_CONFIG.baseurl}/pagamentos/pagar-lote`,pagamento)
  }

  update(pagamento: Pagamento): Observable<Pagamento>{
    return this.http.put<Pagamento>(`${API_CONFIG.baseurl}/pagamentos/${pagamento.id}`,pagamento);
  }

  delete(id: any): Observable<Pagamento>{
    return this.http.delete<Pagamento>(`${API_CONFIG.baseurl}/pagamentos/${id}`);
  }
}

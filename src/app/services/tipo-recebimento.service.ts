import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tipo_Recebimento } from '../models/tipo-recebimento';
import { API_CONFIG } from '../config/api.config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoRecebimentoService {

  constructor(private http: HttpClient) { }

   findById(id: any): Observable<Tipo_Recebimento>{
    return this.http.get<Tipo_Recebimento>(`${API_CONFIG.baseurl}/recebimentos/${id}`);
  }

  findAll(): Observable<Tipo_Recebimento[]>{
    return this.http.get<Tipo_Recebimento[]>(`${API_CONFIG.baseurl}/recebimentos`);
  }

  create(pagamento: Tipo_Recebimento): Observable<Tipo_Recebimento>{
    return this.http.post<Tipo_Recebimento>(`${API_CONFIG.baseurl}/recebimentos`,pagamento)
  }

  update(pagamento: Tipo_Recebimento): Observable<Tipo_Recebimento>{
    return this.http.put<Tipo_Recebimento>(`${API_CONFIG.baseurl}/recebimentos/${pagamento.id}`,pagamento);
  }

  delete(id: any): Observable<Tipo_Recebimento>{
    return this.http.delete<Tipo_Recebimento>(`${API_CONFIG.baseurl}/recebimentos/${id}`);
  }
}

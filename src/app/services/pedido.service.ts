import { Pedido } from '../models/pedido';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api.config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  constructor(private http: HttpClient) { }

  findById(id: any): Observable<Pedido>{
    return this.http.get<Pedido>(`${API_CONFIG.baseurl}/pedidos/${id}`);
  }

  findAll(dataInicio: string, dataFinal: string, situacao: string): Observable<Pedido[]>{
    const params = new HttpParams()
      .set('dataInicio', dataInicio)
      .set('dataFinal', dataFinal)
      .set('situacao', situacao)
    return this.http.get<Pedido[]>(`${API_CONFIG.baseurl}/pedidos`,{params});
  }

  create(Pedido: Pedido): Observable<Pedido>{
    return this.http.post<Pedido>(`${API_CONFIG.baseurl}/pedidos`,Pedido)
  }

  update(Pedido: Pedido): Observable<Pedido>{
    return this.http.put<Pedido>(`${API_CONFIG.baseurl}/pedidos/${Pedido.id}`,Pedido);
  }

  delete(id: any): Observable<Pedido>{
    return this.http.delete<Pedido>(`${API_CONFIG.baseurl}/Pedidos/${id}`);
  }
}

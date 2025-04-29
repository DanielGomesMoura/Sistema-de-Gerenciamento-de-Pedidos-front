import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api.config';
import { Observable } from 'rxjs';
import { Estoque } from '../models/estoque';

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {

  constructor(private http: HttpClient) { }

  findById(id: any): Observable<Estoque>{
    return this.http.get<Estoque>(`${API_CONFIG.baseurl}/estoque/${id}`);
  }

  findAll(): Observable<Estoque[]>{
    return this.http.get<Estoque[]>(`${API_CONFIG.baseurl}/estoque`);
  }

  create(insumos: Estoque): Observable<Estoque>{
    return this.http.post<Estoque>(`${API_CONFIG.baseurl}/estoque`,insumos)
  }

  update(insumos: Estoque): Observable<Estoque>{
    return this.http.put<Estoque>(`${API_CONFIG.baseurl}/estoque/${insumos.id}`,insumos);
  }

  delete(id: any): Observable<Estoque>{
    return this.http.delete<Estoque>(`${API_CONFIG.baseurl}/estoque/${id}`);
  }
}

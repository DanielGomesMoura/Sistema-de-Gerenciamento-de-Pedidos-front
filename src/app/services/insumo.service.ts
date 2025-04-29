import { Cliente } from '../models/cliente';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api.config';
import { Observable } from 'rxjs';
import { Insumos } from '../models/insumos';

@Injectable({
  providedIn: 'root'
})
export class InsumoService {

  constructor(private http: HttpClient) { }

  findById(id: any): Observable<Insumos>{
    return this.http.get<Insumos>(`${API_CONFIG.baseurl}/insumos/${id}`);
  }

  findAll(): Observable<Insumos[]>{
    return this.http.get<Insumos[]>(`${API_CONFIG.baseurl}/insumos`);
  }

  create(insumos: Insumos): Observable<Insumos>{
    return this.http.post<Insumos>(`${API_CONFIG.baseurl}/insumos`,insumos)
  }

  update(insumos: Insumos): Observable<Insumos>{
    return this.http.put<Insumos>(`${API_CONFIG.baseurl}/insumos/${insumos.id}`,insumos);
  }

  delete(id: any): Observable<Insumos>{
    return this.http.delete<Insumos>(`${API_CONFIG.baseurl}/insumos/${id}`);
  }
}

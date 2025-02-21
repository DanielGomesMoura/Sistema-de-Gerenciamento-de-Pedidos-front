import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Compra } from '../models/compra';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

 constructor(private http: HttpClient) { }
 
   findById(id: any): Observable<Compra>{
     return this.http.get<Compra>(`${API_CONFIG.baseurl}/compras/${id}`);
   }
 
   findAll(dataInicio: string, dataFinal: string): Observable<Compra[]>{
     const params = new HttpParams()
       .set('dataInicio', dataInicio)
       .set('dataFinal', dataFinal)
     return this.http.get<Compra[]>(`${API_CONFIG.baseurl}/compras`,{params});
   }
 
   create(compra: Compra): Observable<Compra>{
     return this.http.post<Compra>(`${API_CONFIG.baseurl}/compras`,compra)
   }
 
   update(compra: Compra): Observable<Compra>{
     return this.http.put<Compra>(`${API_CONFIG.baseurl}/compras/${compra.id}`,compra);
   }
 
   delete(id: any): Observable<Compra>{
     return this.http.delete<Compra>(`${API_CONFIG.baseurl}/pedidos/${id}`);
   }
}

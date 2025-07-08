import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Pessoas } from '@interfaces/pessoas.interface';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PessoasService {
  constructor(private readonly http: HttpClient) { }

  buscarPessoa(cpf: string) {
    let params = new HttpParams()
    .set('cpf', cpf)
    return this.http.get(`${environment.apiBaseUrl}/pessoas`, { params });
  }

  cadastrarNovaPessoa(pessoa: Pessoas): Observable<Pessoas> {
    return this.http.post<Pessoas>(`${environment.apiBaseUrl}/pessoas`, pessoa);
  }

}

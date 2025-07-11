import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Pessoas, PessoaDados } from '@interfaces/pessoas.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PessoasService {
  constructor(private readonly http: HttpClient) { }

  buscarPessoa(cpf: string): Observable<PessoaDados> {
    let params = new HttpParams()
      .set('cpf', cpf);
    return this.http.get<PessoaDados>(`${environment.apiBaseUrl}/pessoas`, { params });
  }

  cadastrarNovaPessoa(pessoa: PessoaDados): Observable<Pessoas> {
    return this.http.post<Pessoas>(`${environment.apiBaseUrl}/pessoas`, pessoa);
  }

  excluirPessoa(cpf: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/pessoas/${cpf}`);
  }

}

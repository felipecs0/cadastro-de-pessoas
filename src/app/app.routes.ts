// Angular modules
import { Routes } from '@angular/router';

export const routes : Routes = [
  { path : '', redirectTo : '/cadastrar-pessoas', pathMatch : 'full' },
  {
    path: 'cadastrar-pessoas',
    loadComponent: () => import('./pages/cadastrar-pessoas/cadastrar-pessoas.component').then(m => m.CadastrarPessoasComponent),
  },
  {
    path: 'consultar-dados/:id',
    loadComponent: () => import('./pages/consultar-dados/consultar-dados.component').then(m => m.ConsultarDadosComponent),
  },
  {
    path: '**',
    loadComponent : () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];


import { createHttpFactory, SpectatorHttp } from '@ngneat/spectator';
import { PessoasService } from './pessoas.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '../interceptors/token/token.interceptor';

describe('PessoasService', () => {
  let spectator: SpectatorHttp<PessoasService>;
  let service: PessoasService;

  const createHttp = createHttpFactory({
    service: PessoasService,
    providers: [
      provideHttpClientTesting(),
      {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptor,
        multi: true
      }
    ]
  });

  beforeEach(() => {
    spectator = createHttp();
    service = spectator.service;
  });

});

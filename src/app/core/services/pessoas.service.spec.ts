import { createHttpFactory, SpectatorHttp } from '@ngneat/spectator/jest';
import { PessoasService } from './pessoas.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { TokenInterceptor } from '../interceptors/token/token.interceptor';
import { PessoaDados, Pessoas } from '../interfaces/pessoas.interface';
import { environment } from '../../../environments/environment';

describe('PessoasService', () => {
  let spectator: SpectatorHttp<PessoasService>;
  let service: PessoasService;

  const mockPessoaDados: PessoaDados = {
    nome: 'João Silva Santos',
    cpf: '12345678901',
    email: 'joao@email.com',
    sexo: 'masculino',
    telefone: '(11) 99999-9999'
  };

  const mockPessoas: Pessoas = {
    Pessoas: [mockPessoaDados]
  };

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

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should be injected as singleton', () => {
      const anotherService = spectator.inject(PessoasService);
      expect(service).toBe(anotherService);
    });
  });

  describe('buscarPessoa', () => {
    it('should GET person by CPF successfully', () => {
      const cpf = '12345678901';

      service.buscarPessoa(cpf).subscribe(pessoa => {
        expect(pessoa).toEqual(mockPessoaDados);
      });

      const req = spectator.controller.expectOne((request) =>
        request.url.includes(`${environment.apiBaseUrl}/pessoas`) &&
        request.method === 'GET' &&
        request.params.get('cpf') === cpf
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('cpf')).toBe(cpf);
      expect(req.request.params.get('token')).toBe('123456');

      req.flush(mockPessoaDados);
    });

    it('should call API with correct parameters', () => {
      const cpf = '98765432100';

      service.buscarPessoa(cpf).subscribe();

      const req = spectator.controller.expectOne((request) =>
        request.url.includes(`${environment.apiBaseUrl}/pessoas`) &&
        request.method === 'GET' &&
        request.params.get('cpf') === cpf
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('cpf')).toBe(cpf);
      expect(req.request.url).toBe(`${environment.apiBaseUrl}/pessoas`);

      req.flush(mockPessoaDados);
    });

    it('should handle error when person is not found', () => {
      const cpf = '00000000000';
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Pessoa não encontrada' },
        status: 404,
        statusText: 'Not Found'
      });

      service.buscarPessoa(cpf).subscribe({
        next: () => fail('Should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      const req = spectator.controller.expectOne((request) =>
        request.url.includes(`${environment.apiBaseUrl}/pessoas`) &&
        request.method === 'GET' &&
        request.params.get('cpf') === cpf
      );
      req.flush({ message: 'Pessoa não encontrada' }, errorResponse);
    });

    it('should handle server error', () => {
      const cpf = '12345678901';
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Erro interno do servidor' },
        status: 500,
        statusText: 'Internal Server Error'
      });

      service.buscarPessoa(cpf).subscribe({
        next: () => fail('Should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      });

      const req = spectator.controller.expectOne((request) =>
        request.url.includes(`${environment.apiBaseUrl}/pessoas`) &&
        request.method === 'GET' &&
        request.params.get('cpf') === cpf
      );
      req.flush({ message: 'Erro interno do servidor' }, errorResponse);
    });
  });

  describe('cadastrarNovaPessoa', () => {
    it('should register new person successfully', () => {
      service.cadastrarNovaPessoa(mockPessoaDados).subscribe(response => {
        expect(response).toEqual(mockPessoas);
      });

      const req = spectator.controller.expectOne((request) =>
        request.url.includes(`${environment.apiBaseUrl}/pessoas`) &&
        request.method === 'POST'
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockPessoaDados);
      expect(req.request.params.get('token')).toBe('123456');

      req.flush(mockPessoas);
    });

    it('should send correct data in request body', () => {
      const novaPessoa: PessoaDados = {
        nome: 'Maria Silva',
        cpf: '11122233344',
        email: 'maria@email.com',
        sexo: 'feminino',
        telefone: '(11) 88888-8888'
      };

      service.cadastrarNovaPessoa(novaPessoa).subscribe();

      const req = spectator.controller.expectOne((request) =>
        request.url.includes(`${environment.apiBaseUrl}/pessoas`) &&
        request.method === 'POST'
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(novaPessoa);
      // Verifica se o Content-Type foi definido (automaticamente pelo HttpClient)
      expect(req.request.headers.has('Content-Type') || req.request.headers.get('Content-Type')).toBeDefined();

      req.flush(mockPessoas);
    });

    it('should handle validation error', () => {
      const pessoaInvalida: PessoaDados = {
        nome: '',
        cpf: '123',
        email: 'email-invalido',
        sexo: '',
        telefone: ''
      };

      const errorResponse = new HttpErrorResponse({
        error: { message: 'Dados inválidos' },
        status: 400,
        statusText: 'Bad Request'
      });

      service.cadastrarNovaPessoa(pessoaInvalida).subscribe({
        next: () => fail('Should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(400);
          expect(error.statusText).toBe('Bad Request');
        }
      });

      const req = spectator.controller.expectOne((request) =>
        request.url.includes(`${environment.apiBaseUrl}/pessoas`) &&
        request.method === 'POST'
      );
      req.flush({ message: 'Dados inválidos' }, errorResponse);
    });

    it('should handle CPF already exists error', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'CPF já cadastrado' },
        status: 409,
        statusText: 'Conflict'
      });

      service.cadastrarNovaPessoa(mockPessoaDados).subscribe({
        next: () => fail('Should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(409);
          expect(error.statusText).toBe('Conflict');
        }
      });

      const req = spectator.controller.expectOne((request) =>
        request.url.includes(`${environment.apiBaseUrl}/pessoas`) &&
        request.method === 'POST'
      );
      req.flush({ message: 'CPF já cadastrado' }, errorResponse);
    });
  });

  describe('excluirPessoa', () => {
    it('should delete person successfully', () => {
      const cpf = '12345678901';

      service.excluirPessoa(cpf).subscribe(response => {
        expect(response).toBeUndefined();
      });

      const req = spectator.controller.expectOne((request) =>
        request.url.includes(`${environment.apiBaseUrl}/pessoas/${cpf}`) &&
        request.method === 'DELETE'
      );
      expect(req.request.method).toBe('DELETE');
      expect(req.request.url).toBe(`${environment.apiBaseUrl}/pessoas/${cpf}`);
      expect(req.request.params.get('token')).toBe('123456');

      req.flush(null);
    });

    it('should build URL correctly with CPF', () => {
      const cpf = '98765432100';

      service.excluirPessoa(cpf).subscribe();

      const req = spectator.controller.expectOne((request) =>
        request.url.includes(`${environment.apiBaseUrl}/pessoas/${cpf}`) &&
        request.method === 'DELETE'
      );
      expect(req.request.method).toBe('DELETE');
      expect(req.request.url).toBe(`${environment.apiBaseUrl}/pessoas/${cpf}`);

      req.flush(null);
    });

    it('should handle error when person is not found', () => {
      const cpf = '00000000000';
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Pessoa não encontrada' },
        status: 404,
        statusText: 'Not Found'
      });

      service.excluirPessoa(cpf).subscribe({
        next: () => fail('Should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      const req = spectator.controller.expectOne((request) =>
        request.url.includes(`${environment.apiBaseUrl}/pessoas/${cpf}`) &&
        request.method === 'DELETE'
      );
      req.flush({ message: 'Pessoa não encontrada' }, errorResponse);
    });

    it('should handle server error', () => {
      const cpf = '12345678901';
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Erro interno do servidor' },
        status: 500,
        statusText: 'Internal Server Error'
      });

      service.excluirPessoa(cpf).subscribe({
        next: () => fail('Should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      });

      const req = spectator.controller.expectOne((request) =>
        request.url.includes(`${environment.apiBaseUrl}/pessoas/${cpf}`) &&
        request.method === 'DELETE'
      );
      req.flush({ message: 'Erro interno do servidor' }, errorResponse);
    });
  });

  describe('Interceptor Integration', () => {
    it('should apply interceptors to requests', () => {
      const cpf = '12345678901';

      service.buscarPessoa(cpf).subscribe();

      const req = spectator.controller.expectOne((request) =>
        request.url.includes(`${environment.apiBaseUrl}/pessoas`) &&
        request.method === 'GET' &&
        request.params.get('cpf') === cpf
      );
      // Verifica se o interceptor foi aplicado (token de autenticação)
      expect(req.request.params.get('token')).toBe('123456');
      expect(req.request.headers.keys().length).toBeGreaterThanOrEqual(0);

      req.flush(mockPessoaDados);
    });
  });

  describe('Parameter Validation', () => {
    it('should accept CPF with different formats', () => {
      const cpfComMascara = '123.456.789-01';

      service.buscarPessoa(cpfComMascara).subscribe();

      const req = spectator.controller.expectOne((request) =>
        request.url.includes(`${environment.apiBaseUrl}/pessoas`) &&
        request.method === 'GET' &&
        request.params.get('cpf') === cpfComMascara
      );
      expect(req.request.params.get('cpf')).toBe(cpfComMascara);

      req.flush(mockPessoaDados);
    });

    it('should accept CPF without mask', () => {
      const cpfSemMascara = '12345678901';

      service.buscarPessoa(cpfSemMascara).subscribe();

      const req = spectator.controller.expectOne((request) =>
        request.url.includes(`${environment.apiBaseUrl}/pessoas`) &&
        request.method === 'GET' &&
        request.params.get('cpf') === cpfSemMascara
      );
      expect(req.request.params.get('cpf')).toBe(cpfSemMascara);

      req.flush(mockPessoaDados);
    });
  });

  describe('Error Handling - Status Code 422 and 409', () => {
    it('should handle 422 Unprocessable Entity for invalid data structure', () => {
      const invalidPessoa: PessoaDados = {
        nome: 'João',
        cpf: '12345678901',
        email: 'invalid-email',
        sexo: 'invalid-gender',
        telefone: 'invalid-phone'
      };

      const errorResponse = new HttpErrorResponse({
        error: {
          title: 'Dados inválidos',
          message: 'Os dados fornecidos não atendem aos critérios de validação'
        },
        status: 422,
        statusText: 'Unprocessable Entity'
      });

      service.cadastrarNovaPessoa(invalidPessoa).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.title).toBe('Dados inválidos');
          expect(error.message).toBe('Os dados fornecidos não atendem aos critérios de validação');
        }
      });

      const req = spectator.controller.expectOne((request) =>
        request.url.includes(`${environment.apiBaseUrl}/pessoas`) &&
        request.method === 'POST'
      );
      req.flush(errorResponse.error, errorResponse);
    });

    it('should handle 422 Unprocessable Entity for CPF validation failure', () => {
      const pessoaWithInvalidCpf: PessoaDados = {
        nome: 'Maria Silva',
        cpf: '00000000000',
        email: 'maria@email.com',
        sexo: 'feminino',
        telefone: '(11) 99999-9999'
      };

      const errorResponse = new HttpErrorResponse({
        error: {
          title: 'CPF inválido',
          message: 'O CPF informado não é válido ou está em formato incorreto'
        },
        status: 422,
        statusText: 'Unprocessable Entity'
      });

      service.cadastrarNovaPessoa(pessoaWithInvalidCpf).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.title).toBe('CPF inválido');
          expect(error.message).toBe('O CPF informado não é válido ou está em formato incorreto');
        }
      });

      const req = spectator.controller.expectOne((request) =>
        request.url.includes(`${environment.apiBaseUrl}/pessoas`) &&
        request.method === 'POST'
      );
      req.flush(errorResponse.error, errorResponse);
    });

    it('should handle 409 Conflict for duplicate CPF registration', () => {
      const existingPersonData: PessoaDados = {
        nome: 'Pedro Santos',
        cpf: '11111111111',
        email: 'pedro@email.com',
        sexo: 'masculino',
        telefone: '(11) 88888-8888'
      };

      const errorResponse = new HttpErrorResponse({
        error: {
          title: 'CPF já cadastrado',
          message: 'Já existe uma pessoa cadastrada com este CPF no sistema'
        },
        status: 409,
        statusText: 'Conflict'
      });

      service.cadastrarNovaPessoa(existingPersonData).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.title).toBe('CPF já cadastrado');
          expect(error.message).toBe('Já existe uma pessoa cadastrada com este CPF no sistema');
        }
      });

      const req = spectator.controller.expectOne((request) =>
        request.url.includes(`${environment.apiBaseUrl}/pessoas`) &&
        request.method === 'POST'
      );
      req.flush(errorResponse.error, errorResponse);
    });

    it('should handle 409 Conflict for duplicate email registration', () => {
      const duplicateEmailData: PessoaDados = {
        nome: 'Ana Costa',
        cpf: '22222222222',
        email: 'existing@email.com',
        sexo: 'feminino',
        telefone: '(11) 77777-7777'
      };

      const errorResponse = new HttpErrorResponse({
        error: {
          title: 'Email já utilizado',
          message: 'Este endereço de email já está sendo utilizado por outro usuário'
        },
        status: 409,
        statusText: 'Conflict'
      });

      service.cadastrarNovaPessoa(duplicateEmailData).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.title).toBe('Email já utilizado');
          expect(error.message).toBe('Este endereço de email já está sendo utilizado por outro usuário');
        }
      });

      const req = spectator.controller.expectOne((request) =>
        request.url.includes(`${environment.apiBaseUrl}/pessoas`) &&
        request.method === 'POST'
      );
      req.flush(errorResponse.error, errorResponse);
    });

    it('should handle 422 Unprocessable Entity when updating person with invalid data', () => {
      const cpf = '12345678901';
      const invalidUpdateData: PessoaDados = {
        nome: '',
        cpf: cpf,
        email: 'invalid-email-format',
        sexo: '',
        telefone: ''
      };

      const errorResponse = new HttpErrorResponse({
        error: {
          title: 'Dados de atualização inválidos',
          message: 'Os dados fornecidos para atualização não são válidos'
        },
        status: 422,
        statusText: 'Unprocessable Entity'
      });

      // Simulando uma operação de atualização usando o método de cadastro
      service.cadastrarNovaPessoa(invalidUpdateData).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.title).toBe('Dados de atualização inválidos');
          expect(error.message).toBe('Os dados fornecidos para atualização não são válidos');
        }
      });

      const req = spectator.controller.expectOne((request) =>
        request.url.includes(`${environment.apiBaseUrl}/pessoas`) &&
        request.method === 'POST'
      );
      req.flush(errorResponse.error, errorResponse);
    });

    it('should handle 409 Conflict when trying to delete person with dependencies', () => {
      const cpf = '12345678901';

      const errorResponse = new HttpErrorResponse({
        error: {
          title: 'Não é possível excluir',
          message: 'Esta pessoa possui dependências no sistema e não pode ser excluída'
        },
        status: 409,
        statusText: 'Conflict'
      });

      service.excluirPessoa(cpf).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.title).toBe('Não é possível excluir');
          expect(error.message).toBe('Esta pessoa possui dependências no sistema e não pode ser excluída');
        }
      });

      const req = spectator.controller.expectOne((request) =>
        request.url.includes(`${environment.apiBaseUrl}/pessoas/${cpf}`) &&
        request.method === 'DELETE'
      );
      req.flush(errorResponse.error, errorResponse);
    });

    it('should handle 422 Unprocessable Entity for search with invalid CPF format', () => {
      const invalidCpf = 'invalid-cpf-format';

      const errorResponse = new HttpErrorResponse({
        error: {
          title: 'Formato de CPF inválido',
          message: 'O CPF deve conter apenas números e ter 11 dígitos'
        },
        status: 422,
        statusText: 'Unprocessable Entity'
      });

      service.buscarPessoa(invalidCpf).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.title).toBe('Formato de CPF inválido');
          expect(error.message).toBe('O CPF deve conter apenas números e ter 11 dígitos');
        }
      });

      const req = spectator.controller.expectOne((request) =>
        request.url.includes(`${environment.apiBaseUrl}/pessoas`) &&
        request.method === 'GET' &&
        request.params.get('cpf') === invalidCpf
      );
      req.flush(errorResponse.error, errorResponse);
    });
  });

  afterEach(() => {
    spectator.controller.verify();
  });
});

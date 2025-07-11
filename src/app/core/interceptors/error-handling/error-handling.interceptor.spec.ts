import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { ErrorHandlingInterceptor } from './error-handling.interceptor';
import { HttpErrorResponse, HttpHandler, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { throwError, of } from 'rxjs';

describe('ErrorHandlingInterceptor', () => {
  let spectator: SpectatorService<ErrorHandlingInterceptor>;
  let interceptor: ErrorHandlingInterceptor;
  let httpHandlerMock: HttpHandler;
  let messageService: MessageService;

  const createService = createServiceFactory({
    service: ErrorHandlingInterceptor,
    mocks: [MessageService]
  });

  beforeEach(() => {
    spectator = createService();
    interceptor = spectator.service;
    messageService = spectator.inject(MessageService);
    httpHandlerMock = {
      handle: jest.fn()
    } as unknown as HttpHandler;
  });

  describe('Warning Status Codes (422, 409)', () => {
    it('should show warning message for 422 Unprocessable Entity', (done) => {
      const request = new HttpRequest('POST', '/test', {});
      const errorResponse = new HttpErrorResponse({
        status: HttpStatusCode.UnprocessableEntity,
        statusText: 'Unprocessable Entity',
        error: {
          title: 'Dados inválidos',
          message: 'Os dados fornecidos são inválidos'
        }
      });

      (httpHandlerMock.handle as jest.Mock).mockReturnValue(throwError(() => errorResponse));

      interceptor.intercept(request, httpHandlerMock).subscribe({
        error: (error) => {
          expect(messageService.add).toHaveBeenCalledWith({
            severity: 'warn',
            summary: 'Dados inválidos',
            detail: 'Os dados fornecidos são inválidos',
            key: 'tl',
            life: 5000
          });
          expect(error).toEqual(errorResponse.error);
          done();
        }
      });
    });

    it('should show warning message for 409 Conflict', (done) => {
      const request = new HttpRequest('POST', '/test', {});
      const errorResponse = new HttpErrorResponse({
        status: HttpStatusCode.Conflict,
        statusText: 'Conflict',
        error: {
          title: 'Conflito de dados',
          message: 'CPF já cadastrado no sistema'
        }
      });

      (httpHandlerMock.handle as jest.Mock).mockReturnValue(throwError(() => errorResponse));

      interceptor.intercept(request, httpHandlerMock).subscribe({
        error: (error) => {
          expect(messageService.add).toHaveBeenCalledWith({
            severity: 'warn',
            summary: 'Conflito de dados',
            detail: 'CPF já cadastrado no sistema',
            key: 'tl',
            life: 5000
          });
          expect(error).toEqual(errorResponse.error);
          done();
        }
      });
    });

    it('should handle 422 error without title and message', (done) => {
      const request = new HttpRequest('POST', '/test', {});
      const errorResponse = new HttpErrorResponse({
        status: HttpStatusCode.UnprocessableEntity,
        statusText: 'Unprocessable Entity',
        error: {
          // Sem title e message
        }
      });

      (httpHandlerMock.handle as jest.Mock).mockReturnValue(throwError(() => errorResponse));

      interceptor.intercept(request, httpHandlerMock).subscribe({
        error: (error) => {
          expect(messageService.add).toHaveBeenCalledWith({
            severity: 'warn',
            summary: undefined,
            detail: undefined,
            key: 'tl',
            life: 5000
          });
          expect(error).toEqual(errorResponse.error);
          done();
        }
      });
    });

    it('should handle 409 error with null error object', (done) => {
      const request = new HttpRequest('POST', '/test', {});
      const errorResponse = new HttpErrorResponse({
        status: HttpStatusCode.Conflict,
        statusText: 'Conflict',
        error: null
      });

      (httpHandlerMock.handle as jest.Mock).mockReturnValue(throwError(() => errorResponse));

      interceptor.intercept(request, httpHandlerMock).subscribe({
        error: (error) => {
          expect(messageService.add).toHaveBeenCalledWith({
            severity: 'warn',
            summary: undefined,
            detail: undefined,
            key: 'tl',
            life: 5000
          });
          expect(error).toEqual(errorResponse.error);
          done();
        }
      });
    });
  });

  describe('Non-Warning Status Codes', () => {
    it('should not show warning message for 400 Bad Request', (done) => {
      const request = new HttpRequest('POST', '/test', {});
      const errorResponse = new HttpErrorResponse({
        status: HttpStatusCode.BadRequest,
        statusText: 'Bad Request',
        error: {
          title: 'Requisição inválida',
          message: 'Dados da requisição estão incorretos'
        }
      });

      (httpHandlerMock.handle as jest.Mock).mockReturnValue(throwError(() => errorResponse));

      interceptor.intercept(request, httpHandlerMock).subscribe({
        error: (error) => {
          expect(messageService.add).not.toHaveBeenCalled();
          expect(error).toEqual(errorResponse.error);
          done();
        }
      });
    });

    it('should not show warning message for 401 Unauthorized', (done) => {
      const request = new HttpRequest('GET', '/test');
      const errorResponse = new HttpErrorResponse({
        status: HttpStatusCode.Unauthorized,
        statusText: 'Unauthorized',
        error: {
          title: 'Não autorizado',
          message: 'Token inválido'
        }
      });

      (httpHandlerMock.handle as jest.Mock).mockReturnValue(throwError(() => errorResponse));

      interceptor.intercept(request, httpHandlerMock).subscribe({
        error: (error) => {
          expect(messageService.add).not.toHaveBeenCalled();
          expect(error).toEqual(errorResponse.error);
          done();
        }
      });
    });

    it('should not show warning message for 404 Not Found', (done) => {
      const request = new HttpRequest('GET', '/test');
      const errorResponse = new HttpErrorResponse({
        status: HttpStatusCode.NotFound,
        statusText: 'Not Found',
        error: {
          title: 'Não encontrado',
          message: 'Recurso não encontrado'
        }
      });

      (httpHandlerMock.handle as jest.Mock).mockReturnValue(throwError(() => errorResponse));

      interceptor.intercept(request, httpHandlerMock).subscribe({
        error: (error) => {
          expect(messageService.add).not.toHaveBeenCalled();
          expect(error).toEqual(errorResponse.error);
          done();
        }
      });
    });

    it('should not show warning message for 500 Internal Server Error', (done) => {
      const request = new HttpRequest('GET', '/test');
      const errorResponse = new HttpErrorResponse({
        status: HttpStatusCode.InternalServerError,
        statusText: 'Internal Server Error',
        error: {
          title: 'Erro interno',
          message: 'Erro interno do servidor'
        }
      });

      (httpHandlerMock.handle as jest.Mock).mockReturnValue(throwError(() => errorResponse));

      interceptor.intercept(request, httpHandlerMock).subscribe({
        error: (error) => {
          expect(messageService.add).not.toHaveBeenCalled();
          expect(error).toEqual(errorResponse.error);
          done();
        }
      });
    });
  });

  describe('Successful Requests', () => {
    it('should not intercept successful requests', (done) => {
      const request = new HttpRequest('GET', '/test');
      const successResponse = { data: 'success' };

      (httpHandlerMock.handle as jest.Mock).mockReturnValue(of(successResponse));

      interceptor.intercept(request, httpHandlerMock).subscribe({
        next: (response) => {
          expect(messageService.add).not.toHaveBeenCalled();
          expect(response).toEqual(successResponse);
          done();
        }
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple 422 errors in sequence', (done) => {
      const request = new HttpRequest('POST', '/test', {});
      const errorResponse1 = new HttpErrorResponse({
        status: HttpStatusCode.UnprocessableEntity,
        statusText: 'Unprocessable Entity',
        error: {
          title: 'Erro 1',
          message: 'Primeira mensagem de erro'
        }
      });

      const errorResponse2 = new HttpErrorResponse({
        status: HttpStatusCode.UnprocessableEntity,
        statusText: 'Unprocessable Entity',
        error: {
          title: 'Erro 2',
          message: 'Segunda mensagem de erro'
        }
      });

      (httpHandlerMock.handle as jest.Mock)
        .mockReturnValueOnce(throwError(() => errorResponse1))
        .mockReturnValueOnce(throwError(() => errorResponse2));

      // Primeira requisição
      interceptor.intercept(request, httpHandlerMock).subscribe({
        error: () => {
          expect(messageService.add).toHaveBeenCalledWith({
            severity: 'warn',
            summary: 'Erro 1',
            detail: 'Primeira mensagem de erro',
            key: 'tl',
            life: 5000
          });

          // Segunda requisição
          interceptor.intercept(request, httpHandlerMock).subscribe({
            error: () => {
              expect(messageService.add).toHaveBeenCalledWith({
                severity: 'warn',
                summary: 'Erro 2',
                detail: 'Segunda mensagem de erro',
                key: 'tl',
                life: 5000
              });
              expect(messageService.add).toHaveBeenCalledTimes(2);
              done();
            }
          });
        }
      });
    });

    it('should handle 409 error with nested error structure', (done) => {
      const request = new HttpRequest('POST', '/test', {});
      const errorResponse = new HttpErrorResponse({
        status: HttpStatusCode.Conflict,
        statusText: 'Conflict',
        error: {
          error: {
            title: 'Conflito aninhado',
            message: 'Estrutura de erro aninhada'
          }
        }
      });

      (httpHandlerMock.handle as jest.Mock).mockReturnValue(throwError(() => errorResponse));

      interceptor.intercept(request, httpHandlerMock).subscribe({
        error: (error) => {
          expect(messageService.add).toHaveBeenCalledWith({
            severity: 'warn',
            summary: undefined, // Pois está acessando error.error?.title diretamente
            detail: undefined,  // Pois está acessando error.error?.message diretamente
            key: 'tl',
            life: 5000
          });
          expect(error).toEqual(errorResponse.error);
          done();
        }
      });
    });
  });
});

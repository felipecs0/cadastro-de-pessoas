import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { ErrorHandlingInterceptor } from './error-handling.interceptor';
import { HttpErrorResponse, HttpHandler, HttpRequest } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { throwError } from 'rxjs';

describe('ErrorHandlingInterceptor', () => {
  let spectator: SpectatorService<ErrorHandlingInterceptor>;
  let interceptor: ErrorHandlingInterceptor;
  let httpHandlerMock: HttpHandler;

  const createService = createServiceFactory({
    service: ErrorHandlingInterceptor,
    mocks: [MessageService]
  });

  beforeEach(() => {
    spectator = createService();
    interceptor = spectator.service;
    httpHandlerMock = {
      handle: jasmine.createSpy('handle')
    } as unknown as HttpHandler;
  });

  it('should show error message when status is not 401', () => {
    const request = new HttpRequest('GET', '/test');
    const errorResponse = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
      error: 'Test error'
    });

    (httpHandlerMock.handle as jasmine.Spy).and.returnValue(throwError(() => errorResponse));

    interceptor.intercept(request, httpHandlerMock).subscribe({
      error: () => {
        expect(spectator.inject(MessageService).add).toHaveBeenCalledWith({
          severity: 'error',
          summary: 'Server Error',
          detail: errorResponse.message,
          key: 'tl',
          life: 5000
        });
      }
    });
  });

  it('should not show error message when status is 401', () => {
    const request = new HttpRequest('GET', '/test');
    const errorResponse = new HttpErrorResponse({
      status: 401,
      statusText: 'Unauthorized',
      error: 'Test error'
    });

    (httpHandlerMock.handle as jasmine.Spy).and.returnValue(throwError(() => errorResponse));

    interceptor.intercept(request, httpHandlerMock).subscribe({
      error: () => {
        expect(spectator.inject(MessageService).add).not.toHaveBeenCalled();
      }
    });
  });
});

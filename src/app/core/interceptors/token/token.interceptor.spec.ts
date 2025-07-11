import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { TokenInterceptor } from './token.interceptor';
import { HttpHandler, HttpRequest } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from '@env/environment';

describe('TokenInterceptor', () => {
  let spectator: SpectatorService<TokenInterceptor>;
  let interceptor: TokenInterceptor;
  let httpHandlerMock: HttpHandler;

  const createService = createServiceFactory({
    service: TokenInterceptor,
  });

  beforeEach(() => {
    spectator = createService();
    interceptor = spectator.service;
    httpHandlerMock = {
      handle: jest.fn()
    } as unknown as HttpHandler;
  });

  it('should create interceptor', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should call setTokenQueryParams and handle request', () => {
    const request = new HttpRequest('GET', 'test-url');
    const modifiedRequest = new HttpRequest('GET', 'test-url')
    modifiedRequest.params.set('token', environment.tokenApi);

    jest.spyOn(interceptor, 'setTokenQueryParams').mockReturnValue(modifiedRequest);
    (httpHandlerMock.handle as jest.Mock).mockReturnValue(of([]));

    interceptor.intercept(request, httpHandlerMock);

    expect(interceptor.setTokenQueryParams).toHaveBeenCalledWith(request);
    expect(httpHandlerMock.handle).toHaveBeenCalledWith(modifiedRequest);
  });

  it('should add token parameter when setTokenQueryParams is called', () => {
    const request = new HttpRequest('GET', 'test-url');
    const result = interceptor.setTokenQueryParams(request);

    expect(result.params.has('token')).toBe(true);
    expect(result.params.get('token')).toBe(environment.tokenApi);
  });
});

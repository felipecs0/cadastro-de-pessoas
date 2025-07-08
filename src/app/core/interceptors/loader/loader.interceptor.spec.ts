import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { LoaderInterceptor } from './loader.interceptor';
import { HttpErrorResponse, HttpHandler, HttpRequest } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

describe('LoaderInterceptor', () => {
  let spectator: SpectatorService<LoaderInterceptor>;
  let interceptor: LoaderInterceptor;
  let httpHandlerMock: HttpHandler;

  const createService = createServiceFactory({
    service: LoaderInterceptor,
    mocks: []
  });

  beforeEach(() => {
    spectator = createService();
    interceptor = spectator.service;
    httpHandlerMock = {
      handle: jasmine.createSpy('handle')
    } as unknown as HttpHandler;
  });


  it('should create loader reference on constructor', () => {
    const componentRef = interceptor.componentRef;
    expect(componentRef).toBeDefined();
  });

  it('should hidden loader when intercepting request', fakeAsync(() => {
    const req = new HttpRequest('GET', '/test');

    const showLoaderSpy = spyOn(interceptor, 'showLoader');
    const hideLoaderSpy = spyOn(interceptor, 'hideLoader');

    (httpHandlerMock.handle as jasmine.Spy).and.returnValue(of());
    interceptor.intercept(req, httpHandlerMock).subscribe(() => {
      expect(showLoaderSpy).toHaveBeenCalled();
    });

    tick(550);
    expect(hideLoaderSpy).toHaveBeenCalled();
  }));

  it('should hide loader on error', (done) => {
    const req = new HttpRequest('GET', '/test');
    const hideLoaderSpy = spyOn(interceptor, 'hideLoader');

    const errorResponse = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
      error: 'Test error'
    });

    (httpHandlerMock.handle as jasmine.Spy).and.returnValue(throwError(() => errorResponse));

    interceptor.intercept(req, httpHandlerMock).subscribe({
      error: () => {
        expect(hideLoaderSpy).toHaveBeenCalled();
        done();
      }
    });
  });

  it('should append loader to body when showing', fakeAsync(() => {
    spyOn(document, 'getElementById').and.returnValue(null);
    const appendChildSpy = spyOn(interceptor['renderer2'], 'appendChild');

    interceptor.showLoader();
    tick(100);

    expect(appendChildSpy).toHaveBeenCalled();
  }));

  it('should remove loader from body when hiding', fakeAsync(() => {
    const removeChildSpy = spyOn(interceptor['renderer2'], 'removeChild');
    const domElementRemove = spyOn(interceptor.domElement as HTMLElement, "remove");

    interceptor.hideLoader();
    tick(100);

    expect(removeChildSpy).toHaveBeenCalled();
    expect(domElementRemove).toHaveBeenCalled();
  }));

  it('should not show loader when same request is made multiple times', fakeAsync(() => {
    const req = new HttpRequest('GET', '/test');
    const showLoaderSpy = spyOn(interceptor, 'showLoader');
    const mockResponse = { type: 4, body: {} };

    (httpHandlerMock.handle as jasmine.Spy).and.returnValue(of(mockResponse));

    interceptor.intercept(req, httpHandlerMock).subscribe();

    tick(550);
    expect(showLoaderSpy).toHaveBeenCalledTimes(1);
  }));

  it('should filter out non-HttpResponse events', fakeAsync(() => {
    const req = new HttpRequest('GET', '/test');
    const hideLoaderSpy = spyOn(interceptor, 'hideLoader');
    const mockSentEvent = { type: 0 };

    (httpHandlerMock.handle as jasmine.Spy).and.returnValue(of(mockSentEvent));

    interceptor.intercept(req, httpHandlerMock).subscribe();

    tick(550);
    expect(hideLoaderSpy).toHaveBeenCalled();
  }));
});

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { environment } from "@env/environment";
import { Observable } from "rxjs";

export class TokenInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = this.setTokenQueryParams(request);
    return next.handle(request);
  }

  setTokenQueryParams(request: HttpRequest<unknown>): HttpRequest<unknown> {
    return request.clone({
      setParams: { token: environment.tokenApi }
    });
  }
}

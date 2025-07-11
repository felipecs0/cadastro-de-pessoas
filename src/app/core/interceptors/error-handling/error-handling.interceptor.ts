import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const WARNING_STATUSES = [HttpStatusCode.UnprocessableEntity, HttpStatusCode.Conflict];
const MESSAGE_KEY = 'tl';
const MESSAGE_LIFE_TIME = 5000;

export class ErrorHandlingInterceptor implements HttpInterceptor {
  private readonly messageService = inject(MessageService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (WARNING_STATUSES.includes(error.status)) {
          this.messageService.add({
            severity: 'warn',
            summary: error.error?.title,
            detail: error.error?.message,
            key: MESSAGE_KEY,
            life: MESSAGE_LIFE_TIME
          });
        }
        return throwError(() => error.error);
      })
    );
  }
}

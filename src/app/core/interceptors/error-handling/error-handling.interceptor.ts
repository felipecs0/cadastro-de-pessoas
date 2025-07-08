import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export class ErrorHandlingInterceptor implements HttpInterceptor {
  messageService: MessageService = inject(MessageService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status !== 401) {
          this.messageService.add({ severity: 'error', summary: 'Server Error', detail: error.message, key: 'tl', life: 5000 });
        }
        return throwError(() => error);
      })
    );
  }
}

import { ProgressSpinner } from 'primeng/progressspinner';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { ApplicationRef, ComponentRef, createComponent, inject, RendererFactory2 } from "@angular/core";
import { catchError, distinctUntilChanged, filter, finalize, Observable, tap, throwError } from "rxjs";

export class LoaderInterceptor implements HttpInterceptor {
  private appRef = inject(ApplicationRef);
  private renderer2 = inject(RendererFactory2).createRenderer(null, null);

  public domElement?: HTMLElement;
  public componentRef?: ComponentRef<ProgressSpinner>;

  constructor() {
    this.createLoaderRef();
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      distinctUntilChanged(),
      tap(() => this.showLoader()),
      filter((event) => event instanceof HttpResponse),
      finalize(() => setTimeout(() => this.hideLoader(), 500)),
      catchError((error) => {
        this.hideLoader();
        return throwError(() => error)
      })
    );
  }

  private createLoaderRef() {
    this.componentRef = createComponent(ProgressSpinner, {
      environmentInjector: this.appRef.injector,
    });

    this.appRef.attachView(this.componentRef.hostView);

    const loaderElement = (this.componentRef.hostView as any).rootNodes[0] as HTMLElement;
    loaderElement.setAttribute('style', 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 9999;');
    loaderElement.id = 'global-loader';

    this.domElement = this.renderer2.createElement('div')
    this.domElement?.setAttribute('id', 'loader-container');
    this.domElement?.setAttribute('style', 'background: #fff9; z-index: 9998; width: 100%; height: 100%; position: fixed; top: 0; left: 0;');
    this.domElement?.appendChild(loaderElement);
  }

  public showLoader() {
    const isShowedLoader = document.getElementById('loader-container');
    if(!isShowedLoader){
      requestAnimationFrame(() => {
        this.renderer2.appendChild(document.body, this.domElement);
      });
    }
  }

  public hideLoader() {
    requestAnimationFrame(() => {
      this.domElement?.remove();
      this.renderer2.removeChild(document.body, this.domElement);
    });
  }
}

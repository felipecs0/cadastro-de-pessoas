import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';


@Component({
  selector    : 'app-not-found',
  templateUrl : './not-found.component.html',
  styleUrls   : ['./not-found.component.scss'],
  standalone  : true,
  imports     : [Button]
})
export class NotFoundComponent {
  constructor(
    private readonly router: Router
  ) { }

  voltarHome(): void {
    this.router.navigate(['/']);
  }

}

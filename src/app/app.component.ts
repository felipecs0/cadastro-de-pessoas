import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { RouterLink, RouterOutlet }     from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet, ToastModule, RouterLink]
})
export class AppComponent implements OnInit {
  public ngOnInit() : void {}
}

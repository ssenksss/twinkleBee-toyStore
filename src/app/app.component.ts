import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.css'],
  standalone: true,
  imports: [RouterModule]
})
export class AppComponent {}
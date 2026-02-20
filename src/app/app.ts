import { Component } from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';

import { NavbarComponent } from './components/navbar/navbar';
import { ChatbotComponent } from './components/chatbot/chatbot';
import { ToastComponent } from './components/toast/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    NavbarComponent,
    ChatbotComponent,
    RouterOutlet,
    ToastComponent

  ],
  templateUrl: './app.html'
})
export class AppComponent {}

import { Component } from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';

import { NavbarComponent } from './components/navbar/navbar';
import { ChatbotComponent } from './components/chatbot/chatbot';
import { ToastComponent } from './components/toast/toast';
import {FooterComponent} from 'src/app/components/footer/footer';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    NavbarComponent,
    ChatbotComponent,
    RouterOutlet,
    ToastComponent,
    FooterComponent

  ],
  templateUrl: './app.html'
})
export class AppComponent {}

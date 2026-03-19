import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from 'src/services/toast.service';
import { ChatbotUiService } from 'src/services/chatbot-ui.service';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.html',
  styleUrls: ['./about.css'],
  imports: [CommonModule, RouterLink],
})
export class AboutComponent {
  constructor(
    private router: Router,
    private toast: ToastService,
    private chatbotUi: ChatbotUiService
  ) {}

  openChatbot() {
    this.chatbotUi.open();

  }

  goToToy(id: number) {
    this.router.navigate(['/toy', id]);
  }
}

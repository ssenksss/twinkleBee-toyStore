import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChatbotUiService } from 'src/services/chatbot-ui.service';
import { ChatbotService, ChatMessage } from 'src/services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  templateUrl: './chatbot.html',
  styleUrls: ['./chatbot.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ChatbotComponent implements OnInit {
  messages: ChatMessage[] = [];
  input = '';
  open = false;

  constructor(
    private bot: ChatbotService,
    public chatbotUi: ChatbotUiService
  ) {}

  ngOnInit() {
    this.messages = this.bot.start();

    this.chatbotUi.opened$.subscribe(value => {
      this.open = value;

      if (this.open && this.messages.length === 0) {
        this.messages = this.bot.start();
      }
    });
  }

  toggle() {
    this.chatbotUi.toggle();
  }

  send() {
    if (!this.input.trim()) return;

    const userMsg = this.input;
    this.messages.push({ from: 'user', text: userMsg });
    this.input = '';

    const botMsgs = this.bot.handleUser(userMsg);
    this.messages.push(...botMsgs);
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.html',
  styleUrls: ['./about.css'],
  imports: [CommonModule]
})
export class AboutComponent {
  openChatbot() {
   
    console.log('AI Bee activated 🐝');
  }
  
}

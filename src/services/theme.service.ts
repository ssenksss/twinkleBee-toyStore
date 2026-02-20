import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  dark = false;

  toggle() {
    this.dark = !this.dark;
    document.body.classList.toggle('dark', this.dark);
  }
}

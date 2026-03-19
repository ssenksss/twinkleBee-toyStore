import { Injectable, signal } from '@angular/core';

export interface ToastItem {
  id: number;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private idCounter = 0;

  toasts = signal<ToastItem[]>([]);

  show(message: string, duration: number = 2500) {
    const id = ++this.idCounter;

    this.toasts.update(current => [...current, { id, message }]);

    window.setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  remove(id: number) {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }

  clear() {
    this.toasts.set([]);
  }
}

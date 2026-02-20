import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {

  message = '';
  visible = false;

  show(msg: string) {
    this.message = msg;
    this.visible = true;

    setTimeout(() => {
      this.visible = false;
    }, 2500);
  }
}

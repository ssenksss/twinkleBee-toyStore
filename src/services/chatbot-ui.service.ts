import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatbotUiService {
  private openedSubject = new BehaviorSubject<boolean>(false);
  opened$ = this.openedSubject.asObservable();

  open() {
    this.openedSubject.next(true);
  }

  close() {
    this.openedSubject.next(false);
  }

  toggle() {
    this.openedSubject.next(!this.openedSubject.value);
  }
}

import { Message } from './message.model';

export interface ChatbotSession {
  sessionId: string;
  messages: Message[];
}

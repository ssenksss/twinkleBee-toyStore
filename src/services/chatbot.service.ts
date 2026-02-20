import { Injectable } from '@angular/core';
import { ToyService } from './toy.service';
import { CartService } from './cart.service';

import { TargetGroup, Toy } from 'src/models/toy.model';

type ToyType = { id: number; label: string };

export type BotState =
  | 'idle'
  | 'chooseMode'
  | 'search_name'
  | 'search_description'
  | 'search_type'
  | 'search_age'
  | 'search_group'
  | 'search_mFrom'
  | 'search_mTo'
  | 'search_priceMin'
  | 'search_priceMax'
  | 'search_reviewText'
  | 'search_minReviewRating'
  | 'order_pick'
  | 'order_confirm'
  | 'order_qty';

export interface ChatMessage {
  from: 'bot' | 'user';
  text: string;
  toyId?: number;
  action?: 'openToy' | 'openCart';
}

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private state: BotState = 'idle';

  private draft = {
    name: '',
    description: '',
    typeId: null as number | null,
    age: null as number | null,
    group: null as TargetGroup | null,
    manufacturedFrom: '' as string,
    manufacturedTo: '' as string,
    priceMin: null as number | null,
    priceMax: null as number | null,
    reviewText: '',
    minReviewRating: 'all' as 'all' | number,
    pickedToyId: null as number | null,
    qty: 1
  };

  constructor(private toyService: ToyService, private cart: CartService) {}

  start(): ChatMessage[] {
    this.state = 'chooseMode';
    this.resetDraft();

    return [
      {
        from: 'bot',
        text:
          `Ćao! Ja sam TwinkleBot 🐝\n` +
          `Mogu da ti pomognem da *pretražiš* igračke ili da *rezervišeš*.\n\n` +
          `Napiši:\n` +
          `• "pretraga"\n` +
          `• "naruci"\n` +
          `• "reset"`
      }
    ];
  }

  handleUser(textRaw: string): ChatMessage[] {
    const text = (textRaw ?? '').trim();
    const lower = text.toLowerCase();

    if (lower === 'reset' || lower === 'restart') return this.start();

    if (lower === 'pomoć' || lower === 'pomoc') {
      return [
        {
          from: 'bot',
          text:
            `Komande:\n` +
            `• pretraga\n` +
            `• naruci\n` +
            `• reset\n\n` +
            `Na svim pitanjima možeš da napišeš "preskoci".`
        }
      ];
    }

    if (lower === 'otkazi' || lower === 'otkaži' || lower === 'cancel') {
      this.state = 'chooseMode';
      this.resetOrderOnly();
      return [{ from: 'bot', text: 'Okej — otkazano. Napiši "pretraga" ili "naruci".' }];
    }

    switch (this.state) {
      case 'chooseMode': {
        if (lower.includes('pretrag')) {
          this.resetDraft();
          this.state = 'search_name';
          return [{ from: 'bot', text: 'Unesi ključnu reč za *naziv* (ili "preskoci").' }];
        }

        if (lower.includes('naruc') || lower.includes('naruč')) {
          this.resetOrderOnly();
          this.state = 'order_pick';
          return [
            {
              from: 'bot',
              text:
                `Order dijalog ✅\n` +
                `Napiši ID igračke (npr. 3) ili deo naziva.\n` +
                `Možeš i "otkazi".`
            }
          ];
        }

        return [{ from: 'bot', text: 'Napiši "pretraga" ili "naruci".' }];
      }

      case 'search_name': {
        if (!this.isSkip(lower)) this.draft.name = text;
        this.state = 'search_description';
        return [{ from: 'bot', text: 'Unesi ključnu reč za *opis* (ili "preskoci").' }];
      }

      case 'search_description': {
        if (!this.isSkip(lower)) this.draft.description = text;
        this.state = 'search_type';

        const types = this.toyService
          .getToyTypes()
          .map((t: ToyType) => `${t.id}=${t.label}`)
          .join(', ');

        return [{ from: 'bot', text: `Izaberi *tip* (upiši broj) ili "preskoci".\nTipovi: ${types}` }];
      }

      case 'search_type': {
        if (!this.isSkip(lower)) {
          const n = Number(text);
          if (!Number.isNaN(n)) this.draft.typeId = n;
        }
        this.state = 'search_age';
        return [{ from: 'bot', text: 'Unesi uzrast (broj godina, npr. 6) ili "preskoci".' }];
      }

      case 'search_age': {
        if (!this.isSkip(lower)) {
          const n = Number(text);
          if (!Number.isNaN(n)) this.draft.age = n;
        }
        this.state = 'search_group';
        return [{ from: 'bot', text: 'Ciljna grupa: "devojcica", "decak" ili "svi" (ili "preskoci").' }];
      }

      case 'search_group': {
        if (!this.isSkip(lower)) {
          const g = lower as TargetGroup;
          if (g === 'devojcica' || g === 'decak' || g === 'svi') this.draft.group = g;
        }
        this.state = 'search_mFrom';
        return [{ from: 'bot', text: 'Datum proizvodnje OD (YYYY-MM-DD) ili "preskoci".' }];
      }

      case 'search_mFrom': {
        if (!this.isSkip(lower)) this.draft.manufacturedFrom = text;
        this.state = 'search_mTo';
        return [{ from: 'bot', text: 'Datum proizvodnje DO (YYYY-MM-DD) ili "preskoci".' }];
      }

      case 'search_mTo': {
        if (!this.isSkip(lower)) this.draft.manufacturedTo = text;
        this.state = 'search_priceMin';
        return [{ from: 'bot', text: 'Minimalna cena (RSD) ili "preskoci".' }];
      }

      case 'search_priceMin': {
        if (!this.isSkip(lower)) {
          const n = Number(text);
          if (!Number.isNaN(n)) this.draft.priceMin = n;
        }
        this.state = 'search_priceMax';
        return [{ from: 'bot', text: 'Maksimalna cena (RSD) ili "preskoci".' }];
      }

      case 'search_priceMax': {
        if (!this.isSkip(lower)) {
          const n = Number(text);
          if (!Number.isNaN(n)) this.draft.priceMax = n;
        }
        this.state = 'search_reviewText';
        return [{ from: 'bot', text: 'Recenzije: ključna reč u tekstu recenzije (ili "preskoci").' }];
      }

      case 'search_reviewText': {
        if (!this.isSkip(lower)) this.draft.reviewText = text;
        this.state = 'search_minReviewRating';
        return [{ from: 'bot', text: 'Minimalna ocena recenzije (1-5) ili "preskoci".' }];
      }

      case 'search_minReviewRating': {
        if (!this.isSkip(lower)) {
          const n = Number(text);
          if (!Number.isNaN(n) && n >= 1 && n <= 5) this.draft.minReviewRating = n;
        }

        const results = this.search();
        this.state = 'chooseMode';

        if (results.length === 0) {
          return [{ from: 'bot', text: 'Nisam našao ništa 😕 Napiši "pretraga" da pokušamo opet.' }];
        }

        const msgs: ChatMessage[] = [{ from: 'bot', text: `Našao sam ${results.length} rezultata. Evo top 3:` }];

        results.slice(0, 3).forEach((t: Toy) => {
          msgs.push({
            from: 'bot',
            text:
              `• ${t.name}\n` +
              `Tip: ${t.type.label} · Uzrast: ${t.ageMin}-${t.ageMax} · Grupa: ${t.targetGroup}\n` +
              `Datum: ${t.manufactureDate} · Cena: ${t.price} RSD · Recenzije: ${t.reviews.length}`,
            toyId: t.id,
            action: 'openToy'
          });
        });

        msgs.push({ from: 'bot', text: 'Ako želiš da rezervišeš neku, napiši "naruci".' });
        return msgs;
      }

      case 'order_pick': {
        const picked = this.pickToy(text);
        if (!picked) return [{ from: 'bot', text: 'Ne nalazim tu igračku. Probaj ID ili deo naziva.' }];

        this.draft.pickedToyId = picked.id;
        this.state = 'order_confirm';

        return [
          {
            from: 'bot',
            text:
              `Izabrala si:\n` +
              `• ${picked.name}\n` +
              `Cena: ${picked.price} RSD · Tip: ${picked.type.label} · Uzrast: ${picked.ageMin}-${picked.ageMax}\n\n` +
              `Rezervišemo?\nNapiši: "da" ili "ne" (ili "otkazi").`,
            toyId: picked.id,
            action: 'openToy'
          }
        ];
      }

      case 'order_confirm': {
        if (lower === 'ne' || lower === 'n' || lower === 'no') {
          this.resetOrderOnly();
          this.state = 'order_pick';
          return [{ from: 'bot', text: 'Okej. Izaberi drugu igračku (ID ili deo naziva) ili "otkazi".' }];
        }

        if (lower === 'da' || lower === 'd' || lower === 'yes') {
          this.state = 'order_qty';
          return [{ from: 'bot', text: 'Koliko komada? (npr. 1, 2, 3)' }];
        }

        return [{ from: 'bot', text: 'Napiši "da" ili "ne" (ili "otkazi").' }];
      }

      case 'order_qty': {
        const q = Number(text);
        this.draft.qty = !Number.isNaN(q) && q > 0 ? Math.floor(q) : 1;

        const toy = this.toyService.getToyById(this.draft.pickedToyId!);
        if (!toy) {
          this.state = 'order_pick';
          this.resetOrderOnly();
          return [{ from: 'bot', text: 'Ups — ne mogu da nađem igračku. Probaj ponovo: "naruci".' }];
        }

        this.cart.addItem(toy, this.draft.qty);
        const total = toy.price * this.draft.qty;

        this.state = 'chooseMode';
        this.resetOrderOnly();

        return [
          {
            from: 'bot',
            text:
              `Rezervisano ✅\n` +
              `• ${toy.name}\n` +
              `Količina: ${this.draft.qty}\n` +
              `Ukupno: ${total} RSD\n\n` +
              `Želiš da otvoriš korpu?`,
            action: 'openCart'
          },
          { from: 'bot', text: 'Napiši "pretraga" ili "naruci".' }
        ];
      }

      default:
        this.state = 'chooseMode';
        return [{ from: 'bot', text: 'Napiši "pretraga" ili "naruci".' }];
    }
  }

  private isSkip(lower: string) {
    return lower === 'preskoci' || lower === 'preskoči' || lower === '-' || lower === 'skip';
  }

  private resetDraft() {
    this.draft = {
      name: '',
      description: '',
      typeId: null,
      age: null,
      group: null,
      manufacturedFrom: '',
      manufacturedTo: '',
      priceMin: null,
      priceMax: null,
      reviewText: '',
      minReviewRating: 'all',
      pickedToyId: null,
      qty: 1
    };
  }

  private resetOrderOnly() {
    this.draft.pickedToyId = null;
    this.draft.qty = 1;
  }

  private search(): Toy[] {
    const normalize = (s: string) => (s ?? '').trim().toLowerCase();

    const name = normalize(this.draft.name);
    const desc = normalize(this.draft.description);
    const reviewText = normalize(this.draft.reviewText);

    const from = this.draft.manufacturedFrom ? new Date(this.draft.manufacturedFrom) : null;
    const to = this.draft.manufacturedTo ? new Date(this.draft.manufacturedTo) : null;

    return this.toyService.getToys().filter((t: Toy) => {
      if (name && !t.name.toLowerCase().includes(name)) return false;
      if (desc && !t.description.toLowerCase().includes(desc)) return false;

      if (this.draft.typeId !== null && t.type.id !== this.draft.typeId) return false;
      if (this.draft.group !== null && t.targetGroup !== this.draft.group) return false;

      if (this.draft.age !== null) {
        if (!(t.ageMin <= this.draft.age && this.draft.age <= t.ageMax)) return false;
      }

      if (from || to) {
        const d = new Date(t.manufactureDate);
        if (from && d < from) return false;
        if (to && d > to) return false;
      }

      if (this.draft.priceMin !== null && t.price < this.draft.priceMin) return false;
      if (this.draft.priceMax !== null && t.price > this.draft.priceMax) return false;

      if (reviewText) {
        const hasText = (t.reviews ?? []).some(r => (r.text ?? '').toLowerCase().includes(reviewText));
        if (!hasText) return false;
      }

      if (this.draft.minReviewRating !== 'all') {
        const min = Number(this.draft.minReviewRating);
        const ok = (t.reviews ?? []).some(r => (r.rating ?? 0) >= min);
        if (!ok) return false;
      }

      return true;
    });
  }

  private pickToy(query: string): Toy | null {
    const q = (query ?? '').trim().toLowerCase();
    const id = Number(q);

    if (!Number.isNaN(id)) return this.toyService.getToyById(id) ?? null;

    const toys = this.toyService.getToys();
    return toys.find(t => t.name.toLowerCase().includes(q)) ?? null;
  }
}

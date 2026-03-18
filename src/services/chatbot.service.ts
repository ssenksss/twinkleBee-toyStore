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
          `Hey there! 🌸 I'm Bee 🐝<br>` +
          `I can help you <b>search</b> for toys or <b>reserve</b> your favorites!<br><br>` +
          `Type one of these to start:<br>` +
          `&bull; search<br>` +
          `&bull; order<br>` +
          `&bull; reset`
      }
    ];
  }


  handleUser(textRaw: string): ChatMessage[] {
    const text = (textRaw ?? '').trim();
    const lower = text.toLowerCase();

    if (lower === 'reset' || lower === 'restart') return this.start();

    if (lower === 'help') {
      return [
        {
          from: 'bot',
          text:
            `Here’s what I can do for you:<br>` +
            `&bull; <b>search</b> → Find the perfect toy<br>` +
            `&bull; <b>order</b> → Reserve a toy you love<br>` +
            `&bull; <b>reset</b> → Start fresh<br><br>` +
            `At any step, you can type "skip" to move on.`
        }
      ];
    }

    if (lower === 'cancel') {
      this.state = 'chooseMode';
      this.resetOrderOnly();
      return [
        {
          from: 'bot',
          text: 'No worries! Your order is canceled.<br>You can type <b>"search"</b> or <b>"order"</b> to continue.'
        }
      ];
    }

    switch (this.state) {
      case 'chooseMode': {
        if (lower.includes('search')) {
          this.resetDraft();
          this.state = 'search_name';
          return [
            {
              from: 'bot',
              text: 'Yay! Let’s start! Type a keyword for the <b>toy name</b> (or "skip").'
            }
          ];
        }

        if (lower.includes('order')) {
          this.resetOrderOnly();
          this.state = 'order_pick';
          return [
            {
              from: 'bot',
              text:
                `🛒 Ready to reserve! Type the <b>toy ID</b> (like 3) or part of its name.<br>` +
                `Or type <b>"cancel"</b> if you change your mind.`
            }
          ];
        }

        return [
          { from: 'bot', text: 'Please type <b>"search"</b> or <b>"order"</b> to get started' }
        ];
      }

      case 'search_name': {
        if (!this.isSkip(lower)) this.draft.name = text;
        this.state = 'search_description';
        return [
          {
            from: 'bot',
            text: 'Now, type a keyword for the <b>description</b> (or "skip").'
          }
        ];
      }

      case 'search_description': {
        if (!this.isSkip(lower)) this.draft.description = text;
        this.state = 'search_type';

        const types = this.toyService
          .getToyTypes()
          .map((t: ToyType) => `${t.id}=${t.label}`)
          .join(', ');

        return [
          {
            from: 'bot',
            text: `Pick a <b>type</b> (type the number) or "skip". Types: ${types}`
          }
        ];
      }

      case 'search_type': {
        if (!this.isSkip(lower)) {
          const n = Number(text);
          if (!Number.isNaN(n)) this.draft.typeId = n;
        }
        this.state = 'search_age';
        return [{ from: 'bot', text: 'Enter <b>age</b> (years, e.g., 6) or "skip".' }];
      }

      case 'search_age': {
        if (!this.isSkip(lower)) {
          const n = Number(text);
          if (!Number.isNaN(n)) this.draft.age = n;
        }
        this.state = 'search_group';
        return [
          { from: 'bot', text: 'Target group: <b>"girls"</b>, <b>"boys"</b>, or <b>"unisex"</b> (or "skip").' }
        ];
      }

      case 'search_group': {
        if (!this.isSkip(lower)) {
          const g = lower as TargetGroup;
          if (g === 'girls' || g === 'boys' || g === 'unisex') this.draft.group = g;
        }
        this.state = 'search_mFrom';
        return [
          { from: 'bot', text: 'Manufactured from (YYYY-MM-DD) or "skip".' }
        ];
      }

      case 'search_mFrom': {
        if (!this.isSkip(lower)) this.draft.manufacturedFrom = text;
        this.state = 'search_mTo';
        return [
          { from: 'bot', text: 'Manufactured to (YYYY-MM-DD) or "skip".' }
        ];
      }

      case 'search_mTo': {
        if (!this.isSkip(lower)) this.draft.manufacturedTo = text;
        this.state = 'search_priceMin';
        return [
          { from: 'bot', text: 'Minimum price (RSD) or "skip".' }
        ];
      }

      case 'search_priceMin': {
        if (!this.isSkip(lower)) {
          const n = Number(text);
          if (!Number.isNaN(n)) this.draft.priceMin = n;
        }
        this.state = 'search_priceMax';
        return [
          { from: 'bot', text: 'Maximum price (RSD) or "skip".' }
        ];
      }

      case 'search_priceMax': {
        if (!this.isSkip(lower)) {
          const n = Number(text);
          if (!Number.isNaN(n)) this.draft.priceMax = n;
        }
        this.state = 'search_reviewText';
        return [
          { from: 'bot', text: 'Review text keyword (or "skip").' }
        ];
      }

      case 'search_reviewText': {
        if (!this.isSkip(lower)) this.draft.reviewText = text;
        this.state = 'search_minReviewRating';
        return [
          { from: 'bot', text: 'Minimum review rating (1-5) or "skip".' }
        ];
      }

      case 'search_minReviewRating': {
        if (!this.isSkip(lower)) {
          const n = Number(text);
          if (!Number.isNaN(n) && n >= 1 && n <= 5) this.draft.minReviewRating = n;
        }

        const results = this.search();
        this.state = 'chooseMode';

        if (results.length === 0) {
          return [
            { from: 'bot', text: 'Oh no 😢 I couldn’t find any toys.<br>Try typing <b>"search"</b> to look again!' }
          ];
        }

        const msgs: ChatMessage[] = [
          { from: 'bot', text: `Yay! 🎉 I found <b>${results.length}</b> toys. Here are the top 3:` }
        ];

        results.slice(0, 3).forEach((t: Toy) => {
          msgs.push({
            from: 'bot',
            text:
              `&bull; <b>${t.name}</b><br>` +
              `Type: ${t.type.label} · Age: ${t.ageMin}-${t.ageMax} · Group: ${t.targetGroup}<br>` +
              `Made on: ${t.manufactureDate} · Price: ${t.price} RSD · Reviews: ${t.reviews.length}`,
            toyId: t.id,
            action: 'openToy'
          });
        });

        msgs.push({ from: 'bot', text: 'If you want to reserve one, type <b>"order"</b> ' });
        return msgs;
      }

      case 'order_pick': {
        const picked = this.pickToy(text);
        if (!picked) return [
          { from: 'bot', text: 'I can’t find that toy 😅<br>Try <b>ID</b> or part of its <b>name</b>.' }
        ];

        this.draft.pickedToyId = picked.id;
        this.state = 'order_confirm';

        return [
          {
            from: 'bot',
            text:
              `You picked:<br>` +
              `&bull; <b>${picked.name}</b><br>` +
              `Price: ${picked.price} RSD · Type: ${picked.type.label} · Age: ${picked.ageMin}-${picked.ageMax}<br><br>` +
              `Shall we reserve it? Type <b>"yes"</b> or <b>"no"</b> (or <b>"cancel"</b>).`,
            toyId: picked.id,
            action: 'openToy'
          }
        ];
      }

      case 'order_confirm': {
        if (lower === 'no') {
          this.resetOrderOnly();
          this.state = 'order_pick';
          return [
            { from: 'bot', text: 'Okay  Choose another toy by <b>ID</b> or <b>name</b>, or type <b>"cancel"</b>.' }
          ];
        }

        if (lower === 'yes') {
          this.state = 'order_qty';
          return [
            { from: 'bot', text: 'How many would you like? ✨ (e.g., 1, 2, 3)' }
          ];
        }

        return [
          { from: 'bot', text: 'Please type <b>"yes"</b> or <b>"no"</b> (or <b>"cancel"</b>).' }
        ];
      }

      case 'order_qty': {
        const q = Number(text);
        this.draft.qty = !Number.isNaN(q) && q > 0 ? Math.floor(q) : 1;

        const toy = this.toyService.getToyById(this.draft.pickedToyId!);
        if (!toy) {
          this.state = 'order_pick';
          this.resetOrderOnly();
          return [
            { from: 'bot', text: 'Oops  I can’t find that toy.<br>Try again: <b>"order"</b>.' }
          ];
        }

        this.cart.addItem(toy, this.draft.qty);
        const total = toy.price * this.draft.qty;

        this.state = 'chooseMode';
        this.resetOrderOnly();

        return [
          {
            from: 'bot',
            text:
              `Reserved ✅<br>` +
              `&bull; <b>${toy.name}</b><br>` +
              `Quantity: ${this.draft.qty}<br>` +
              `Total: ${total} RSD<br><br>` +
              `Want to open your cart?`,
            action: 'openCart'
          },
          { from: 'bot', text: 'Type <b>"search"</b> or <b>"order"</b> to continue ' }
        ];
      }

      default:
        this.state = 'chooseMode';
        return [{ from: 'bot', text: 'Please type "search" or "order" to get started ' }];
    }
  }

  private isSkip(lower: string) {
    return lower === 'skip' || lower === '-' || lower === 'skip!';
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
      if (this.draft.age !== null && !(t.ageMin <= this.draft.age && this.draft.age <= t.ageMax)) return false;
      if (from || to) {
        const d = new Date(t.manufactureDate);
        if (from && d < from) return false;
        if (to && d > to) return false;
      }
      if (this.draft.priceMin !== null && t.price < this.draft.priceMin) return false;
      if (this.draft.priceMax !== null && t.price > this.draft.priceMax) return false;
      if (reviewText && !(t.reviews ?? []).some(r => (r.text ?? '').toLowerCase().includes(reviewText))) return false;
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

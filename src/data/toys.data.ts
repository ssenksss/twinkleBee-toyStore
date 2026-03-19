import { Toy, ToyType } from '../models/toy.model';

export const TOY_TYPES: ToyType[] = [
  { id: 1, label: 'Educational Toys' },
  { id: 2, label: 'Soft Toys' },
  { id: 3, label: 'Outdoor Fun' },
  { id: 4, label: 'Creative Sets' },
  { id: 5, label: 'Baby Toys' },
  { id: 6, label: 'Games & Puzzles' }
];

const t = (id: number): ToyType => {
  const found = TOY_TYPES.find(x => x.id === id);
  if (!found) throw new Error(`Unknown toy type id: ${id}`);
  return found;
};

export const TOYS: Toy[] = [
  {
    id: 1,
    name: 'Cuddle Bear Plush',
    description: 'Ultra-soft teddy bear perfect for bedtime comfort and emotional bonding.',
    type: t(2),
    ageMin: 2,
    ageMax: 6,
    targetGroup: 'unisex',
    manufactureDate: '2024-04-15',
    price: 19.99,
    image: '/cuddle-bear.png',
    reviews: [
      {
        authorType: 'parent',
        rating: 5,
        text: 'Super soft and calming for sleep.',
        date: '2025-01-12'
      },
      {
        authorType: 'child',
        rating: 5,
        text: 'My favorite teddy ever!',
        date: '2025-02-02'
      }
    ]
  },
  {
    id: 2,
    name: 'Smart Builder Blocks Set',
    description: 'Colorful building blocks that boost creativity and motor skills.',
    type: t(1),
    ageMin: 3,
    ageMax: 8,
    targetGroup: 'unisex',
    manufactureDate: '2023-11-03',
    price: 24.99,
    image: '/smart-builder-block-set.png',
    reviews: [
      {
        authorType: 'parent',
        rating: 5,
        text: 'Perfect for development and fun.',
        date: '2024-12-19'
      }
    ]
  },
  {
    id: 3,
    name: 'Turbo Racer RC Car',
    description: 'Fast remote control car designed for outdoor racing fun.',
    type: t(3),
    ageMin: 6,
    ageMax: 12,
    targetGroup: 'boys',
    manufactureDate: '2024-08-21',
    price: 34.99,
    image: '/turbo-racer-rc-car.png',
    reviews: [
      {
        authorType: 'child',
        rating: 5,
        text: 'Super fast and fun!',
        date: '2025-03-07'
      }
    ]
  },
  {
    id: 4,
    name: 'Creative Art Studio Kit',
    description: 'All-in-one art kit with crayons, markers, and stickers.',
    type: t(4),
    ageMin: 5,
    ageMax: 12,
    targetGroup: 'girls',
    manufactureDate: '2024-02-10',
    price: 29.99,
    image: '/creative-art-studio-kit.png',
    reviews: [
      {
        authorType: 'child',
        rating: 5,
        text: 'So many colors to play with!',
        date: '2025-01-28'
      }
    ]
  },
  {
    id: 5,
    name: 'My First Storybook',
    description: 'Beautiful illustrated bedtime book for young readers.',
    type: t(1),
    ageMin: 3,
    ageMax: 7,
    targetGroup: 'unisex',
    manufactureDate: '2022-09-05',
    price: 12.99,
    image: '/my-first-storybook.png',
    reviews: [
      {
        authorType: 'parent',
        rating: 4,
        text: 'Lovely bedtime reading.',
        date: '2024-10-01'
      }
    ]
  },
  {
    id: 6,
    name: 'Dino Explorer Figure',
    description: 'Realistic dinosaur figure for imaginative play.',
    type: t(3),
    ageMin: 4,
    ageMax: 10,
    targetGroup: 'unisex',
    manufactureDate: '2023-06-12',
    price: 15.99,
    image: '/dino-explorer-figure.png',
    reviews: [
      {
        authorType: 'child',
        rating: 5,
        text: 'My dino is awesome!',
        date: '2025-02-14'
      }
    ]
  },
  {
    id: 7,
    name: 'Ocean Adventure Puzzle',
    description: '100-piece puzzle featuring sea animals.',
    type: t(6),
    ageMin: 6,
    ageMax: 12,
    targetGroup: 'unisex',
    manufactureDate: '2024-01-18',
    price: 9.99,
    image: '/ocean-adventure-puzzle.png',
    reviews: [
      {
        authorType: 'parent',
        rating: 4,
        text: 'Fun and educational.',
        date: '2025-01-05'
      }
    ]
  },
  {
    id: 8,
    name: 'Family Word Game',
    description: 'Fun word association game for the whole family.',
    type: t(6),
    ageMin: 8,
    ageMax: 99,
    targetGroup: 'unisex',
    manufactureDate: '2023-12-01',
    price: 21.99,
    image: '/family-word-game.png',
    reviews: [
      {
        authorType: 'parent',
        rating: 5,
        text: 'We play it every weekend!',
        date: '2025-02-20'
      }
    ]
  },
  {
    id: 9,
    name: 'Baby Play Kitchen',
    description: 'Safe and colorful kitchen set for toddlers.',
    type: t(5),
    ageMin: 2,
    ageMax: 5,
    targetGroup: 'girls',
    manufactureDate: '2024-05-30',
    price: 27.99,
    image: '/baby-play-kitchen.png',
    reviews: [
      {
        authorType: 'child',
        rating: 4,
        text: 'I cook for my toys!',
        date: '2025-03-11'
      }
    ]
  },
  {
    id: 10,
    name: 'City Racer Car Pack',
    description: 'Set of 5 mini cars for endless racing fun.',
    type: t(3),
    ageMin: 3,
    ageMax: 10,
    targetGroup: 'boys',
    manufactureDate: '2022-12-20',
    price: 18.99,
    image: '/city-racer-car-pack.png',
    reviews: [
      {
        authorType: 'parent',
        rating: 4,
        text: 'Good quality set.',
        date: '2024-11-08'
      }
    ]
  }
];

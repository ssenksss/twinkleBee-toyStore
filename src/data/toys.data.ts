import { Toy, ToyType } from '../models/toy.model';

export const TOY_TYPES: ToyType[] = [
  { id: 1, label: 'Slagalica' },
  { id: 2, label: 'Slikovnica' },
  { id: 3, label: 'Figura' },
  { id: 4, label: 'Vozilo' },
  { id: 5, label: 'Kreativni set' },
  { id: 6, label: 'Društvena igra' }
];

const t = (id: number) => {
  const found = TOY_TYPES.find(x => x.id === id);
  if (!found) throw new Error(`Unknown toy type id: ${id}`);
  return found;
};

export const TOYS: Toy[] = [
  {
    id: 1,
    name: 'Magični Teddy Bear',
    description: 'Mekana plišana igračka koja umiruje i prati dete u snu.',
    type: t(3),
    ageMin: 2,
    ageMax: 6,
    targetGroup: 'svi',
    manufactureDate: '2024-04-15',
    price: 1999,
    image: '/magic-teddy-bear.jpg',
    reviews: [
      { authorType: 'roditelj', rating: 5, text: 'Predivan i mekan, dete ga ne ispušta.', date: '2025-01-12' },
      { authorType: 'dete', rating: 4, text: 'Moj meda spava sa mnom!', date: '2025-02-02' }
    ]
  },
  {
    id: 2,
    name: 'Kocke za gradnju',
    description: 'Set od 60 kocki za motoriku i kreativnost.',
    type: t(1),
    ageMin: 3,
    ageMax: 8,
    targetGroup: 'svi',
    manufactureDate: '2023-11-03',
    price: 2499,
    image: '/building%20-blocks-set.png',
    reviews: [
      { authorType: 'roditelj', rating: 5, text: 'Odličan kvalitet, super za razvoj motorike.', date: '2024-12-19' }
    ]
  },
  {
    id: 3,
    name: 'RC Auto Sprint',
    description: 'Daljinski upravljač + turbo brzina. Za igru napolju.',
    type: t(4),
    ageMin: 6,
    ageMax: 12,
    targetGroup: 'decak',
    manufactureDate: '2024-08-21',
    price: 3499,
    image: '/remote-control-ar.png',
    reviews: [
      { authorType: 'dete', rating: 5, text: 'Najbrži auto ikad!', date: '2025-03-07' },
      { authorType: 'roditelj', rating: 4, text: 'Baterija traje solidno, lako se koristi.', date: '2025-03-08' }
    ]
  },
  {
    id: 4,
    name: 'Kreativni Art Set',
    description: 'Flomasteri, bojice i nalepnice — sve u jednoj kutiji.',
    type: t(5),
    ageMin: 5,
    ageMax: 12,
    targetGroup: 'devojcica',
    manufactureDate: '2024-02-10',
    price: 2999,
    image: '/Creative%20Art%20Set.jpg',
    reviews: [{ authorType: 'dete', rating: 5, text: 'Volim nalepnice i boje!', date: '2025-01-28' }]
  },
  {
    id: 5,
    name: 'Slikovnica: Mali astronaut',
    description: 'Ilustrovana priča za laku noć sa kratkim poglavljima.',
    type: t(2),
    ageMin: 3,
    ageMax: 7,
    targetGroup: 'svi',
    manufactureDate: '2022-09-05',
    price: 1299,
    image: 'https://placehold.co/640x480?text=Slikovnica',
    reviews: [{ authorType: 'roditelj', rating: 4, text: 'Lepa priča, baš za veče.', date: '2024-10-01' }]
  },
  {
    id: 6,
    name: 'Figura: Dino Rex',
    description: 'Figura dinosaurusa sa pokretnim nogama i repom.',
    type: t(3),
    ageMin: 4,
    ageMax: 10,
    targetGroup: 'svi',
    manufactureDate: '2023-06-12',
    price: 1599,
    image: 'https://placehold.co/640x480?text=Figura',
    reviews: [{ authorType: 'dete', rating: 5, text: 'Rooaaar! Moj dino je najjači.', date: '2025-02-14' }]
  },
  {
    id: 7,
    name: 'Puzzle 100 delova: More',
    description: 'Slagalica sa 100 delova, tema more i životinje.',
    type: t(1),
    ageMin: 6,
    ageMax: 12,
    targetGroup: 'svi',
    manufactureDate: '2024-01-18',
    price: 999,
    image: 'https://placehold.co/640x480?text=Puzzle',
    reviews: [{ authorType: 'roditelj', rating: 4, text: 'Zabavna, ali je potrebno strpljenje.', date: '2025-01-05' }]
  },
  {
    id: 8,
    name: 'Društvena igra: Brzi Pojmovi',
    description: 'Igra asocijacija za celu porodicu, 2–6 igrača.',
    type: t(6),
    ageMin: 8,
    ageMax: 99,
    targetGroup: 'svi',
    manufactureDate: '2023-12-01',
    price: 2199,
    image: 'https://placehold.co/640x480?text=Drustvena+igra',
    reviews: [{ authorType: 'roditelj', rating: 5, text: 'Smejemo se po sat vremena!', date: '2025-02-20' }]
  },
  {
    id: 9,
    name: 'Mini kuhinja set',
    description: 'Pribor i mini namirnice za igru uloga.',
    type: t(5),
    ageMin: 4,
    ageMax: 9,
    targetGroup: 'devojcica',
    manufactureDate: '2024-05-30',
    price: 2799,
    image: 'https://placehold.co/640x480?text=Set+kuhinja',
    reviews: [{ authorType: 'dete', rating: 4, text: 'Pravim supu za mamu.', date: '2025-03-11' }]
  },
  {
    id: 10,
    name: 'Set autića: City Pack',
    description: '5 metalnih autića različitih boja.',
    type: t(4),
    ageMin: 3,
    ageMax: 10,
    targetGroup: 'decak',
    manufactureDate: '2022-12-20',
    price: 1899,
    image: 'https://placehold.co/640x480?text=Autici',
    reviews: [{ authorType: 'roditelj', rating: 4, text: 'Solidan set, dobra izrada.', date: '2024-11-08' }]
  }
];

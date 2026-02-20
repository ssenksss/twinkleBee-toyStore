export interface Toy {
  id: number;
  name: string;
  description: string;

  type: ToyType;
  ageMin: number;
  ageMax: number;
  targetGroup: TargetGroup;
  manufactureDate: string;
  price: number;
  image: string;
  reviews: Review[];
  status?: ToyStatus;
  userRating?: number;
}

export interface ToyType {
  id: number;
  label: string;
}

export type TargetGroup = 'devojcica' | 'decak' | 'svi';
export type ToyStatus = 'rezervisano' | 'pristiglo' | 'otkazano';

export interface Review {
  authorType: 'dete' | 'roditelj';
  rating: number;
  text: string;
  date: string;
}

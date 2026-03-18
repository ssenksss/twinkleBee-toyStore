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

export type TargetGroup = 'girls' | 'boys' | 'unisex';
export type ToyStatus = 'reserved' | 'arrived' | 'canceled';

export interface Review {
  authorType: 'child' | 'parent';
  rating: number;
  text: string;
  date: string;
}

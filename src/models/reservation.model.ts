export interface Reservation {
  id: number;
  toyType: string;
  color: string;
  size: string;
  date: string;
  notes: string;
  userEmail: string;
  phone: string;
  createdAt: string;
  status: 'Pending' | 'In Progress' | 'Ready';
}

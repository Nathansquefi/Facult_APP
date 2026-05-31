export interface Transaction {
  id: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}
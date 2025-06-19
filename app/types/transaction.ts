export interface Transaction {
  id: string;
  username: string;
  transactionType: 'Stake' | 'Borrow' | 'Lend';
  token: string;
  amount: number;
  status?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
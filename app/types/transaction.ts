export interface Transaction {
  id: string;
  username: string;
  transactionType: 'Stake' | 'Borrow' | 'Lend';
  token: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  createdAt: string;
  updatedAt: string;
}
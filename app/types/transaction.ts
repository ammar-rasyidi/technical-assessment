export interface Transaction {
  id: string;
  username: string;
  transactionType: 'Stake' | 'Borrow' | 'Lend';
  token: string;
  amount: number;
  status: 'Pending' | 'Completed' | 'Failed';
  description?: string;
  createdAt: string;
  updatedAt: string;
}
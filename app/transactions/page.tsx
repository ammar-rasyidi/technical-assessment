"use client"

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Transaction } from '../types/transaction';
import PaginationControls from '../components/Pagination';

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<'All' | 'Stake' | 'Borrow' | 'Lend'>('All');
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [formData, setFormData] = useState({
    username: '',
    transactionType: 'Stake' as 'Stake' | 'Borrow' | 'Lend',
    token: '',
    amount: 0,
    description: '',
    status: 'Pending'
  });

  const SUPPORTED_TOKENS = [
    'ETH', 'BTC', 'USDT', 'USDC', 'DAI', 
    'SOL', 'BNB', 'XRP', 'ADA', 'DOT',
    'MATIC', 'AVAX', 'LTC', 'DOGE', 'SHIB',
    'TRX', 'UNI', 'LINK', 'ATOM', 'XLM'
  ];


  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = { page: currentPage, limit: itemsPerPage };
      
      if (filter !== 'All') {
        params.type = filter;
      }
      
      const res = await axios.get(
        'http://localhost:5800/api/transactions',
        { params }
      );
      
      setTransactions(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
      setTotalItems(res.data.pagination.totalItems);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [filter, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      username: '',
      transactionType: 'Stake',
      token: '',
      amount: 0,
      description: '',
      status: 'Pending'
    });
  };

  // Open create modal
  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
    setFormData({
      username: transaction.username,
      transactionType: transaction.transactionType,
      token: transaction.token,
      amount: transaction.amount,
      description: transaction.description || '',
      status: transaction.status || 'Pending'
    });
    setIsEditModalOpen(true);
  };

  // Create new transaction
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5800/api/transactions', formData);
      setIsCreateModalOpen(false);
      fetchTransactions(); // Refresh transactions
      resetForm();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to create transaction');
    }
  };

  // Update transaction
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTransaction) return;
    
    try {
      await axios.patch(
        `http://localhost:5800/api/transactions/${currentTransaction.id}`,
        formData
      );
      setIsEditModalOpen(false);
      fetchTransactions(); // Refresh transactions
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to create transaction');
    }
  };

  // Delete transaction
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await axios.delete(`http://localhost:5800/api/transactions/${id}`);
        fetchTransactions(); // Refresh transactions
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to create transaction');
    }
    }
  };

  const transactionTypes = ['All', 'Stake', 'Borrow', 'Lend'] as const;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Transaction Dashboard</h1>
      
      {errorMsg && (
        <div className="mb-4 rounded bg-red-100 px-4 py-2 text-red-800">
          {errorMsg}
          <button onClick={() => setErrorMsg(null)} className="ml-2">×</button>
        </div>
      )}

      {/* Header with Create Button */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
          {transactionTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`rounded-lg px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base ${
                filter === type
                  ? 'bg-blue-600 text-white hover:bg-blue-500'
                  : 'bg-gray-600 text-white hover:bg-gray-500'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        
        <button
          onClick={openCreateModal}
          className="w-full rounded-lg bg-green-600 px-4 py-3 text-white hover:bg-green-500 sm:w-auto sm:py-2"
        >
          <span className="hidden sm:inline">+ Create Transaction</span>
          <span className="sm:hidden">+ Create New</span>
        </button>
      </div>

      {/* Transactions Table */}
      {loading ? (
        <p>Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p>No transactions found</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Username</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Token</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr 
                  key={transaction.id} 
                  className={index % 2 === 0 ? 'bg-gray-50 text-gray-800' : 'bg-white text-gray-800'}
                >
                  <td className="border-b px-4 py-3 text-gray-800">{transaction.username}</td>
                  <td className="border-b px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      transaction.transactionType === 'Stake'
                        ? 'bg-green-200 text-green-800'
                        : transaction.transactionType === 'Borrow'
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-blue-200 text-blue-800'
                    }`}>
                      {transaction.transactionType}
                    </span>
                  </td>
                  <td className="border-b px-4 py-3 text-gray-800">{transaction.token}</td>
                  <td className="border-b px-4 py-3 text-gray-800">{transaction.amount}</td>
                  <td className="border-b px-4 py-3 capitalize text-gray-800">{transaction.status || '—'}</td>
                  <td className="border-b px-4 py-3 text-gray-800">{transaction.description || '—'}</td>
                  <td className="border-b px-4 py-3">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border-b px-4 py-3">
                    <div className="flex space-x-2 px-4 py-3">
                      <button
                        onClick={() => openEditModal(transaction)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && transactions.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          visibleItems={transactions.length}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(size) => {
            setItemsPerPage(size);
            setCurrentPage(1); // Reset to first page when changing page size
          }}
        />
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-gray-700">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Create New Transaction</h2>
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label className="mb-2 block text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username ?? ''}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border px-3 py-2"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="mb-2 block text-gray-700">Transaction Type</label>
                <select
                  name="transactionType"
                  value={formData.transactionType ?? 'Stake'}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border px-3 py-2"
                  required
                >
                  <option value="Stake">Stake</option>
                  <option value="Borrow">Borrow</option>
                  <option value="Lend">Lend</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="mb-2 block text-gray-700">Token</label>
                <select
                  name="token"
                  value={formData.token || SUPPORTED_TOKENS[0]}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border px-3 py-2"
                  required
                >
                  {SUPPORTED_TOKENS.map(token => (
                    <option key={token} value={token}>
                      {token}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="mb-2 block text-gray-700">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount ?? 0}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border px-3 py-2"
                  min="0.01"
                  step="any"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status ?? 'Pending'}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border px-3 py-2"
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="mb-2 block text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description ?? ''}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-500"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && currentTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-gray-700">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Edit Transaction</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="mb-2 block text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username ?? ''}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border px-3 py-2"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="mb-2 block text-gray-700">Transaction Type</label>
                <select
                  name="transactionType"
                  value={formData.transactionType ?? 'Stake'}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border px-3 py-2"
                  required
                >
                  <option value="Stake">Stake</option>
                  <option value="Borrow">Borrow</option>
                  <option value="Lend">Lend</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="mb-2 block text-gray-700">Token</label>
                <select
                  name="token"
                  value={formData.token || SUPPORTED_TOKENS[0]}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border px-3 py-2"
                  required
                >
                  {SUPPORTED_TOKENS.map(token => (
                    <option key={token} value={token}>
                      {token}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="mb-2 block text-gray-700">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount ?? 0}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border px-3 py-2"
                  min="0.01"
                  step="any"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="mb-2 block text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status ?? 'Pending'}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border px-3 py-2"
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="mb-2 block text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description ?? ''}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
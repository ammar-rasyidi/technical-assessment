/* eslint-disable no-console */
import dotenv from 'dotenv';
dotenv.config();

import Transaction from '../models/Transaction.js';
import connectDB from '../config/db.js';


const TOKENS = [
  'ETH', 'BTC', 'USDT', 'USDC', 'DAI', 
  'SOL', 'BNB', 'XRP', 'ADA', 'DOT',
  'MATIC', 'AVAX', 'LTC', 'DOGE', 'SHIB',
  'TRX', 'UNI', 'LINK', 'ATOM', 'XLM'
];

const generateUsername = () => {
  const prefixes = ['Crypto', 'DeFi', 'Block', 'Chain', 'NFT', 'Web3', 'Meta', 'Bit', 'Coin', 'Token'];
  const suffixes = ['Trader', 'Whale', 'Pro', 'Master', 'Guru', 'Explorer', 'Voyager', 'Hodler', 'Miner', 'Validator'];
  const names = ['Alex', 'Taylor', 'Jordan', 'Casey', 'Riley', 'Morgan', 'Quinn', 'Jamie', 'Drew', 'Skyler'];
  
  // Random pattern selection
  const pattern = Math.floor(Math.random() * 3);
  
  switch(pattern) {
    case 0:
      return `${prefixes[Math.floor(Math.random() * prefixes.length)]}${names[Math.floor(Math.random() * names.length)]}`;
    case 1:
      return `${names[Math.floor(Math.random() * names.length)]}${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
    default:
      return `${names[Math.floor(Math.random() * names.length)]}${Math.floor(Math.random() * 1000)}`;
  }
};

// Generate transaction data
const generateTransactions = (count) => {

  const transactions = [];
  const types = ['Stake', 'Borrow', 'Lend'];
  
  for (let i = 0; i < count; i++) {
    // Random weighted distribution (more stakes than borrows/lends)
    const username = generateUsername();
    const typeWeights = [0.5, 0.25, 0.25];
    const randomType = Math.random();
    let typeIndex = 0;
    
    if (randomType < typeWeights[0]) typeIndex = 0;
    else if (randomType < typeWeights[0] + typeWeights[1]) typeIndex = 1;
    else typeIndex = 2;
    
    const transactionType = types[typeIndex];
    
    // Token selection - weighted toward top 5
    const tokenIndex = Math.random() < 0.7 
      ? Math.floor(Math.random() * 5)  // 70% chance for top 5 tokens
      : Math.floor(Math.random() * TOKENS.length);
      
    const token = TOKENS[tokenIndex];
    
    // Generate realistic amounts based on token
    const tokenFactors = {
      BTC: { min: 0.001, max: 5, decimals: 8 },
      ETH: { min: 0.01, max: 50, decimals: 7 },
      USDT: { min: 10, max: 100000, decimals: 2 },
      USDC: { min: 10, max: 100000, decimals: 2 },
      default: { min: 0.1, max: 10000, decimals: 4 }
    };
    
    const factor = tokenFactors[token] || tokenFactors.default;
    const rawAmount = factor.min + (Math.random() * (factor.max - factor.min));
    const amount = parseFloat(rawAmount.toFixed(factor.decimals));
    
    // Generate realistic timestamp (last 90 days)
    const daysAgo = Math.floor(Math.random() * 90);
    const hoursAgo = Math.floor(Math.random() * 24);
    const minutesAgo = Math.floor(Math.random() * 60);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);
    createdAt.setHours(createdAt.getHours() - hoursAgo);
    createdAt.setMinutes(createdAt.getMinutes() - minutesAgo);
    
    transactions.push({
      username,
      transactionType,
      token,
      amount,
      createdAt,
      updatedAt: createdAt
    });
  }
  
  return transactions;
};

// Run seeding process
const seedDatabase = async () => {
  try {
    // Connect to DB
    await connectDB();
    
    // Clear existing transactions
    await Transaction.deleteMany({});
    console.log('Existing transactions cleared');

    // Generate new transactions
    const transactions = generateTransactions(50);
    
    // Insert into database
    await Transaction.insertMany(transactions);
    console.log(`Successfully added ${transactions.length} transactions`);
    
    // Exit process
    process.exit(0);
  } catch (err) {
    console.error('❌failed to add transactions data:', err.message);
    process.exit(1);
  }
};

// Execute seeder if run directly
if (process.argv[1].includes('transactionSeeder.js')) {
  seedDatabase();
}

export default seedDatabase;
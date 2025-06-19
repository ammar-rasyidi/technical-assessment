import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  transactionType: {
    type: String,
    required: true,
    enum: ['Stake', 'Borrow', 'Lend'],
    trim: true
  },
  token: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
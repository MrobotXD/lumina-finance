const mongoose = require('mongoose');

const debtSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  creditor: { type: String, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Pendiente', 'Pagada'],
    default: 'Pendiente'
  },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Debt', debtSchema);

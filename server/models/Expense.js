const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  amount: { type: Number, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Comida', 'Transporte', 'Entretenimiento', 'Servicios', 'Salud', 'Otros']
  },
  date: { type: Date, required: true, index: true },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);

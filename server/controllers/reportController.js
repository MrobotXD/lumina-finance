const Expense = require('../models/Expense');
const Debt = require('../models/Debt');
const Budget = require('../models/Budget');

const bulkImportExpenses = async (req, res) => {
  try {
    const { data } = req.body; // Array of objects
    if (!Array.isArray(data)) return res.status(400).json({ message: 'Invalid data format' });

    const results = { success: 0, errors: [] };
    const operations = [];

    data.forEach((item, index) => {
      // Basic Validation
      if (!item.amount || isNaN(item.amount) || !item.category || !item.date) {
        results.errors.push({ row: index + 1, error: 'Missing or invalid required fields' });
        return;
      }

      operations.push(Expense.create({
        ...item,
        user: req.user.id,
        amount: parseFloat(item.amount),
        date: new Date(item.date)
      }));
    });

    await Promise.all(operations);
    results.success = operations.length;

    res.status(201).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const bulkImportDebts = async (req, res) => {
  try {
    const { data } = req.body;
    if (!Array.isArray(data)) return res.status(400).json({ message: 'Invalid data format' });

    const results = { success: 0, errors: [] };
    const operations = [];

    data.forEach((item, index) => {
      if (!item.creditor || !item.amount || !item.dueDate) {
        results.errors.push({ row: index + 1, error: 'Missing required fields' });
        return;
      }
      operations.push(Debt.create({
        ...item,
        user: req.user.id,
        amount: parseFloat(item.amount),
        dueDate: new Date(item.dueDate)
      }));
    });

    await Promise.all(operations);
    results.success = operations.length;
    res.status(201).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { bulkImportExpenses, bulkImportDebts };

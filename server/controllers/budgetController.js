const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { user: req.user.id, month: req.body.month, year: req.body.year },
      req.body,
      { upsert: true, new: true }
    );
    res.status(201).json(budget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getBudgetStats = async (req, res) => {
  try {
    const { month, year } = req.query;
    const budget = await Budget.findOne({ user: req.user.id, month, year });
    if (!budget) return res.status(404).json({ message: 'Budget not found for this period' });

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    const expenses = await Expense.find({
      user: req.user.id,
      date: { $gte: start, $lte: end }
    });

    const totalSpent = expenses.reduce((acc, exp) => acc + exp.amount, 0);
    res.json({
      limit: budget.limit,
      spent: totalSpent,
      remaining: budget.limit - totalSpent,
      expenses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBudgets, createBudget, getBudgetStats };

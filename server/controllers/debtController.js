const Debt = require('../models/Debt');

const getDebts = async (req, res) => {
  try {
    const debts = await Debt.find({ user: req.user.id }).sort('dueDate');
    res.json(debts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDebt = async (req, res) => {
  try {
    const debt = await Debt.create({ ...req.body, user: req.user.id });
    res.status(201).json(debt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateDebt = async (req, res) => {
  try {
    const debt = await Debt.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!debt) return res.status(404).json({ message: 'Debt not found' });
    res.json(debt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteDebt = async (req, res) => {
  try {
    const debt = await Debt.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!debt) return res.status(404).json({ message: 'Debt not found' });
    res.json({ message: 'Debt deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDebts, createDebt, updateDebt, deleteDebt };

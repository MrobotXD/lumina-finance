const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getBudgets, createBudget, getBudgetStats } = require('../controllers/budgetController');

router.use(protect);
router.get('/', getBudgets);
router.post('/', createBudget);
router.get('/stats', getBudgetStats);

module.exports = router;

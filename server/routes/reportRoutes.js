const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { bulkImportExpenses, bulkImportDebts } = require('../controllers/reportController');

router.use(protect);
router.post('/import/expenses', bulkImportExpenses);
router.post('/import/debts', bulkImportDebts);

module.exports = router;

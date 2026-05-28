const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getDebts, createDebt, updateDebt, deleteDebt } = require('../controllers/debtController');

router.use(protect);
router.get('/', getDebts);
router.post('/', createDebt);
router.put('/:id', updateDebt);
router.delete('/:id', deleteDebt);

module.exports = router;

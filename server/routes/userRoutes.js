const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getUserProfile, updateProfile } = require('../controllers/goalController');

router.use(protect);
router.get('/profile', getUserProfile);
router.put('/profile', updateProfile);

module.exports = router;

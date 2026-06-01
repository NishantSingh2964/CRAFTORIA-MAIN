const express = require('express');
const router = express.Router();
const { getExpenses, createExpense, getExpenseStats, deleteExpense } = require('../controllers/expenseController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.route('/')
    .get(getExpenses)
    .post(createExpense);

router.delete('/:id', deleteExpense);
router.get('/stats', getExpenseStats);

module.exports = router;

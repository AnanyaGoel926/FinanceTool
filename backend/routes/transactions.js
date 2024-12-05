const { addExpense, getExpense, deleteExpense, editExpense } = require('../controllers/expense');
const { addIncome, getIncomes, deleteIncome } = require('../controllers/income');
const { addBudget, getBudgets, deleteBudget } = require('../controllers/budget');
const { getChartData } = require('../controllers/chart'); 

const router = require('express').Router();


router.post('/add-income', addIncome)
    .get('/get-incomes', getIncomes)
    .delete('/delete-income/:id', deleteIncome)
    .post('/add-expense', addExpense)
    .get('/get-expenses', getExpense)
    .delete('/delete-expense/:id', deleteExpense)
    .put('/edit-expense/:id', editExpense)
    .post('/add-budget', addBudget)
    .get('/get-budgets', getBudgets)
    .delete('/delete-budget/:id', deleteBudget)
    .get('/chart-data', getChartData);

module.exports = router
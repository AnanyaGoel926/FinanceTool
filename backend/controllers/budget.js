const Budget = require('../models/BudgetModel');

exports.addBudget = async (req, res) => {
    const { name, amount, userId } = req.body;

    if (!name || !amount || !userId) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    try {
        const newBudget = new Budget({ name, amount, userId });
        await newBudget.save();
        res.status(200).json({ message: 'Budget added successfully', budget: newBudget });
    } catch (error) {
        console.error('Error adding budget:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getBudgets = async (req, res) => {
    const { userId } = req.query;

    try {
        const budgets = await Budget.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(budgets);
    } catch (error) {
        console.error('Error fetching budgets:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteBudget = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedBudget = await Budget.findByIdAndDelete(id);
        if (!deletedBudget) {
            return res.status(404).json({ message: 'Budget not found' });
        }
        res.status(200).json({ message: 'Budget deleted successfully' });
    } catch (error) {
        console.error('Error deleting budget:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


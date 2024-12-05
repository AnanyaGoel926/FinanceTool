const ExpenseSchema = require("../models/ExpenseModel")
exports.addExpense = async (req, res) => {
    const { title, amount, category, date, userId } = req.body;

    const expense = new ExpenseSchema({
        title,
        amount,
        category,
        date,
        userId
    });

    try {
        if (!title || !category || !date || !userId) {
            return res.status(400).json({ message: 'All fields are required!' });
        }
        if (amount <= 0 || typeof amount !== 'number') {
            return res.status(400).json({ message: 'Amount must be a positive number!' });
        }
        await expense.save();
        res.status(200).json({ message: 'Expense Added' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getExpense = async (req, res) => {
    const { userId } = req.query;

    try {
        const expenses = await ExpenseSchema.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteExpense = async (req, res) =>{
    const {id} = req.params;
    ExpenseSchema.findByIdAndDelete(id)
        .then((income) =>{
            res.status(200).json({message: 'Expense Deleted'})
        })
        .catch((err) =>{
            res.status(500).json({message: 'Server Error'})
        })
}

exports.editExpense = async (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;

    try {
        const updatedExpense = await ExpenseSchema.findByIdAndUpdate(
            id,
            { amount },
            { new: true } // Return the updated document
        );
        if (!updatedExpense) {
            return res.status(404).json({ message: 'Expense not found!' });
        }
        res.status(200).json(updatedExpense);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
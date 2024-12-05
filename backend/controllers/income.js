const IncomeSchema= require("../models/IncomeModel")

exports.addIncome = async (req, res) => {
    const { title, amount, category, date, userId } = req.body;

    console.log('Received payload:', req.body);

    if (!title || !amount || !category || !date || !userId) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    const income = new IncomeSchema({
        title,
        amount,
        category,
        date,
        userId
    });

    try {
        if (amount <= 0 || typeof amount !== 'number') {
            return res.status(400).json({ message: 'Amount must be a positive number!' });
        }
        await income.save();
        res.status(200).json({ message: 'Income Added' });
    } catch (error) {
        console.error('Error saving income:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getIncomes = async (req, res) => {
    const { userId } = req.query;
    try {
        const incomes = await IncomeSchema.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

exports.deleteIncome = async (req, res) =>{
    const {id} = req.params;
    IncomeSchema.findByIdAndDelete(id)
        .then((income) =>{
            res.status(200).json({message: 'Income Deleted'})
        })
        .catch((err) =>{
            res.status(500).json({message: 'Server Error'})
        })
}
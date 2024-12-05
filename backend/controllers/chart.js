exports.getChartData = async (req, res) => {
    const { type, attributes, userId } = req.query;
    const attributesArray = attributes ? attributes.split(',') : [];

    try {
        let chartData = {
            labels: [],
            incomeData: [],
            expenseData: [],
            budgetData: []
        };

        if (type === 'income') {
            const incomes = await IncomeSchema.find({ userId });
            chartData.labels = incomes.map(income => new Date(income.date).toLocaleDateString());
            attributesArray.forEach(attr => {
                if (attr === 'amount') {
                    chartData.incomeData = incomes.map(income => income.amount);
                }
            });
        } else if (type === 'expense') {
            const expenses = await ExpenseSchema.find({ userId });
            chartData.labels = expenses.map(expense => new Date(expense.date).toLocaleDateString());
            attributesArray.forEach(attr => {
                if (attr === 'amount') {
                    chartData.expenseData = expenses.map(expense => expense.amount);
                }
            });
        } else if (type === 'budget') {
            const budgets = await BudgetSchema.find({ userId });
            chartData.labels = budgets.map(budget => budget.name);
            attributesArray.forEach(attr => {
                if (attr === 'amount') {
                    chartData.budgetData = budgets.map(budget => budget.amount);
                }
            });
        }

        res.status(200).json(chartData);
    } catch (error) {
        console.error('Error fetching chart data:', error);
        res.status(500).send('Server Error');
    }
};

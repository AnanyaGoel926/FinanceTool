import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { InnerLayout } from '../../styles/Layouts';
import { useGlobalContext } from '../../context/globalContext';
import { dollar } from '../../utils/Icons';
import {
    Chart as ChartJs,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJs.register(
    ArcElement,
    Tooltip,
    Legend
);

function Dashboard() {
    const { user, totalExpenses, incomes, expenses, totalIncome, totalBalance, getIncomes, getExpenses, getBudgets, setError } = useGlobalContext();
    const [selectedReportType, setSelectedReportType] = useState('income');
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [pieChartData, setPieChartData] = useState(null);

    useEffect(() => {
        if (user) {
            getIncomes(user._id);
            getExpenses(user._id);
            fetchBudgets(user._id);
        }
    }, [user]);

    const fetchBudgets = async (userId) => {
        try {
            const response = await fetch(`http://localhost:4642/api/v1/get-budgets?userId=${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch budgets');
            }
            const data = await response.json();
            setBudgets(data);
        } catch (error) {
            console.error('Error fetching budgets:', error);
            setError('Failed to fetch budgets');
        }
    };

    const fetchCategories = (type) => {
        let categoryList = [];
        if (type === 'income') {
            categoryList = [...new Set(incomes.map(income => income.category))];
        } else if (type === 'expense') {
            categoryList = [...new Set(expenses.map(expense => expense.category))];
        } else if (type === 'budget') {
            categoryList = [...new Set(budgets.map(budget => budget.name))];
        }
        setCategories(categoryList);
    };

    const handleReportTypeChange = (e) => {
        const type = e.target.value;
        setSelectedReportType(type);
        fetchCategories(type);
        setSelectedCategories([]);
        setPieChartData(null);
    };

    const handleCategoryChange = (e) => {
        const { value, checked } = e.target;
        setSelectedCategories(prev =>
            checked ? [...prev, value] : prev.filter(cat => cat !== value)
        );
    };

    const generateReport = () => {
        const data = selectedCategories.map(category => {
            let amount = 0;
            if (selectedReportType === 'income') {
                amount = incomes.filter(income => income.category === category).reduce((total, income) => total + income.amount, 0);
            } else if (selectedReportType === 'expense') {
                amount = expenses.filter(expense => expense.category === category).reduce((total, expense) => total + expense.amount, 0);
            } else if (selectedReportType === 'budget') {
                const budget = budgets.find(budget => budget.name === category);
                amount = budget ? budget.amount : 0;
            }
            return { category, amount };
        });

        const labels = data.map(item => item.category);
        const amounts = data.map(item => item.amount);

        setPieChartData({
            labels,
            datasets: [
                {
                    data: amounts,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                    ],
                }
            ]
        });
    };

    return (
        <DashboardStyled>
            <InnerLayout>
                <h1>Finance Dashboard</h1>
                <div className="summary-container">
                    <div className="summary-card">
                        <h2>Total Income</h2>
                        <p>{dollar} {totalIncome()}</p>
                    </div>
                    <div className="summary-card">
                        <h2>Total Expense</h2>
                        <p>{dollar} {totalExpenses()}</p>
                    </div>
                    <div className="summary-card">
                        <h2>Total Balance</h2>
                        <p>{dollar} {totalBalance()}</p>
                    </div>
                </div>

                <div className="stats-con">
                    <div className="history-con">
                        <h2>Generate Report</h2>
                        <select value={selectedReportType} onChange={handleReportTypeChange}>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                            <option value="budget">Budget</option>
                        </select>
                        <div className="category-selection">
                            {categories.map((category, index) => (
                                <label key={index}>
                                    <input
                                        type="checkbox"
                                        value={category}
                                        checked={selectedCategories.includes(category)}
                                        onChange={handleCategoryChange}
                                    />
                                    {category}
                                </label>
                            ))}
                        </div>
                        <button className="generate-report" onClick={generateReport}>Generate Report</button>
                    </div>

                    {pieChartData && (
                        <div className="pie-chart">
                            <h2>Pie Chart of Selected Categories</h2>
                            <div className="chart-container">
                                <Pie data={pieChartData} />
                            </div>
                        </div>
                    )}
                </div>
            </InnerLayout>
        </DashboardStyled>
    );
}

const DashboardStyled = styled.div`
    margin: 0 auto;
    padding: 1rem 2rem;
    margin-top: 10rem;

    h1 {
        text-align: center;
        font-size: 2.5rem;
        color: #333;
        margin-bottom: 1rem;
    }
    
    .summary-container {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .summary-card {
        display: inline-block;
        width: 30%;
        vertical-align: top;
        background: #ffffff;
        padding: 1rem;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        margin: 0 0.4rem;
        text-align: center;
        transition: transform 0.3s;
    }
    
    .summary-card:hover {
        transform: scale(1.05);
    }
    
    .summary-card h2 {
        font-size: 1.5rem;
        color: #4a4a4a;
    }
    
    .summary-card p {
        font-size: 1.8rem;
        font-weight: 600;
        color: #333;
    }

    .stats-con {
        width: 100%;
        margin: 0 auto;
    }

    .history-con {
        width: 100%;
        background: #fff;
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.05);
        margin-bottom: 1rem;

        h2 {
            font-size: 1.4rem;
            color: #333;
            margin-bottom: 1rem;
        }

        select {
            width: 100%;
            padding: 0.75rem;
            border-radius: 4px;
            border: 1px solid #ccc;
            margin-bottom: 1rem;
            font-size: 1rem;
        }

        .category-selection {
            margin-bottom: 1rem;

            label {
                display: block;
                margin: 0.5rem 0;
                font-size: 1rem;
                color: #555;
            }

            input {
                margin-right: 0.5rem;
            }
        }

        .generate-report {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 5px;
            background-color: #6c63ff;
            color: #fff;
            cursor: pointer;
            font-size: 1rem;
            transition: background-color 0.3s;

            &:hover {
                background-color: #5a52d2;
            }
        }
    }

    .pie-chart {
        width: 100%;
        margin-top: 1rem;
        background: #fff;
        padding: 1rem;
        border-radius: 15px;
        box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.05);
        text-align: center;

        h2 {
            margin-bottom: 1rem;
            color: #333;
        }

        .chart-container {
            max-width: 300px;
            height: 300px;
            margin: 0 auto;
        }
    }
`;

export default Dashboard;

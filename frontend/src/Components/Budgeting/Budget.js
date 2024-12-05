import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';

function Budget() {
    const { user, setError } = useGlobalContext(); // Use context to get the user and setError
    const [budget, setBudget] = useState({ name: '', amount: '' });
    const [budgets, setBudgets] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [selectedBudget, setSelectedBudget] = useState(null);

    const getBudgets = async () => {
        if (user) {
            try {
                const response = await fetch(`http://localhost:4642/api/v1/get-budgets?userId=${user._id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch budgets');
                }
                const data = await response.json();
                setBudgets(data);
            } catch (error) {
                console.error('Error fetching budgets:', error);
                setError('Failed to fetch budgets');
            }
        }
    };

    const getExpenses = async () => {
        if (user) {
            try {
                const response = await fetch(`http://localhost:4642/api/v1/get-expenses?userId=${user._id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch expenses');
                }
                const data = await response.json();
                setExpenses(data);
            } catch (error) {
                console.error('Error fetching expenses:', error);
                setError('Failed to fetch expenses');
            }
        }
    };

    useEffect(() => {
        getBudgets();
        getExpenses();
    }, [user]);

    const calculateSpent = (category) => {
        return expenses
            .filter(expense => expense.category === category)
            .reduce((total, expense) => total + expense.amount, 0);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBudget(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (user) {
            try {
                await fetch('http://localhost:4642/api/v1/add-budget', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...budget, userId: user._id })
                });
                setBudget({ name: '', amount: '' });
                getBudgets(); // Refresh the list of budgets after adding
            } catch (error) {
                console.error('Error adding budget:', error);
                setError('Failed to add budget');
            }
        } else {
            setError('User not authenticated');
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:4642/api/v1/delete-budget/${id}`, { method: 'DELETE' });
            getBudgets(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting budget:', error);
            setError('Failed to delete budget');
        }
    };

    const handleViewDetails = (category) => {
        setSelectedBudget(selectedBudget === category ? null : category);
    };

    return (
        <BudgetStyled>
            <div className="form-container">
                <h2>Create a New Budget</h2>
                <form className="budget-form" onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Budget Name" 
                        value={budget.name}
                        onChange={handleChange}
                        required 
                    />
                    <input 
                        type="number" 
                        name="amount" 
                        placeholder="Budget Amount" 
                        value={budget.amount}
                        onChange={handleChange}
                        required 
                    />
                    <button type="submit">Add Budget</button>
                </form>
            </div>

            <div className="budget-overview">
                <h3>Budgets Overview</h3>
                <div className="budget-items">
                    {budgets.map((item) => {
                        const spent = calculateSpent(item.name);
                        const isSelected = selectedBudget === item.name;
                        const filteredExpenses = expenses.filter(expense => expense.category === item.name);

                        return (
                            <BudgetOverviewItem key={item._id} spent={spent} budgeted={item.amount}>
                                <h4>{item.name.toUpperCase()}</h4>
                                <p className="budget-info">${spent.toFixed(2)} spent / ${item.amount} Budgeted</p>
                                <div className="progress-bar-container">
                                    <div className="progress-bar" />
                                </div>
                                <p className="budget-remaining">${(item.amount - spent).toFixed(2)} remaining</p>
                                <button className="view-details-button" onClick={() => handleViewDetails(item.name)}>
                                    {isSelected ? "Hide Details" : "View Details"}
                                </button>
                                <button className="delete-button" onClick={() => handleDelete(item._id)}>Delete Budget</button>

                                {/* Conditionally render expenses table for this budget */}
                                {isSelected && (
                                    <div className="expense-details">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Title</th>
                                                    <th>Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredExpenses.map((expense, index) => (
                                                    <tr key={index}>
                                                        <td>{new Date(expense.date).toLocaleDateString('en-US')}</td>
                                                        <td>{expense.title}</td>
                                                        <td>${expense.amount.toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </BudgetOverviewItem>
                        );
                    })}
                </div>
            </div>
        </BudgetStyled>
    );
}

const BudgetStyled = styled.div`
    display: flex;
    justify-content: flex-start;
    max-width: 1200px;
    margin: 2rem auto;
    gap: 2rem;

    .form-container {
        position: fixed;
        top: 10rem;
        left: 2rem;
        width: 300px;
        background: rgba(255, 255, 255, 0.95);
        padding: 1.5rem 2rem;
        border-radius: 8px;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.1);
        height: fit-content;

        h2 {
            margin-bottom: 1rem;
            color: #4a4a4a;
        }

        .budget-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;

            input {
                padding: 0.75rem;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-size: 1rem;
            }

            button {
                padding: 0.75rem;
                border: none;
                border-radius: 4px;
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
    }

    .budget-overview {
        top: 5rem;
        flex: 1.3;
        text-align: left;
        height: fit-content;
        margin-top: 15rem; 
        padding-top: 2rem;
        h3 {
            margin-bottom: 1rem;
            color: #4a4a4a;
        }
        .budget-items {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
    }
`;
const BudgetOverviewItem = styled.div`
    position: relative; /* Enable absolute positioning for children */
    border: 2px solid ${({ spent, budgeted }) => (spent / budgeted > 0.8 ? '#d9534f' : '#6c63ff')};
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 100%;
    max-width: 280px;
    margin: 0 auto;

    h4 {
        margin: 0;
        color: ${({ spent, budgeted }) => (spent / budgeted > 0.8 ? '#d9534f' : '#6c63ff')};
        font-size: 1.2rem;
        font-weight: bold;
    }

    .budget-info {
        font-size: 0.9rem;
        margin: 0.5rem 0;
        color: #555;
    }

    .progress-bar-container {
        background: #e9ecef;
        border-radius: 4px;
        overflow: hidden;
        height: 10px;
        margin: 0.5rem 0;
    }

    .progress-bar {
        height: 100%;
        background: ${({ spent, budgeted }) => (spent / budgeted > 0.8 ? '#d9534f' : '#6c63ff')};
        width: ${({ spent, budgeted }) => `${(spent / budgeted) * 100}%`};
        transition: width 0.3s ease;
    }

    .budget-remaining {
        font-size: 0.8rem;
        color: #555;
    }

    .view-details-button,
    .delete-button {
        margin-top: 0.5rem;
        margin-right: 0.5rem;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        background: ${({ spent, budgeted }) => (spent / budgeted > 0.8 ? '#d9534f' : '#6c63ff')};
        color: #fff;
        font-size: 0.9rem;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .expense-details {
        position: absolute;
        top: 0; /* Align to the top of the budget box */
        right: -365px; /* Position to the right of the budget box */
        background-color: rgba(255, 255, 255, 0.9);
        border-radius: 4px;
        padding: 1rem;
        box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.1);
        width: 350px;
        max-height: 300px;
        overflow-y: auto;

        table {
            width: 100%;
            border-collapse: collapse;
            th, td {
                padding: 0.5rem;
                border-bottom: 1px solid #ddd;
                text-align: left;
            }
            th {
                font-weight: bold;
                color: #4a4a4a;
            }
            td {
                color: #555;
            }
        }
    }
`;
export default Budget;

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import Button from '../Button/Button';
import { toast } from 'react-toastify';

function Expenses() {
    const { user, addExpense, expenses, getExpenses, deleteExpense, totalExpenses, error, setError } = useGlobalContext();
    const [newExpense, setNewExpense] = useState({
        title: '',
        amount: '',
        category: '',
        date: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [editAmount, setEditAmount] = useState('');

    useEffect(() => {
        if (user) {
            getExpenses(user._id) // Pass userId to fetch user-specific data
                .catch(err => {
                    console.error('Error fetching expenses:', err);
                    toast.error('Failed to load expenses');
                });
        }
    }, [user, getExpenses]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewExpense(prevState => ({
            ...prevState,
            [name]: name === 'amount' ? parseFloat(value) : value // Ensure amount is a number
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (user) {
            try {
                await addExpense({ ...newExpense, userId: user._id }); // Include userId when adding expense
                setNewExpense({ title: '', amount: '', category: '', date: '' });
                toast.success('Expense added successfully');
            } catch (err) {
                console.error('Error adding expense:', err);
                toast.error('Failed to add expense');
            }
        } else {
            setError('User not found');
            toast.error('User not authenticated');
        }
    };

    const handleEditSubmit = async (id) => {
        if (!editAmount) return;
        try {
            await fetch(`http://localhost:4642/api/v1/edit-expense/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount: editAmount })
            });
            setEditingId(null);
            setEditAmount('');
            getExpenses(user._id); // Refresh expenses for the current user
            toast.success('Expense updated successfully');
        } catch (err) {
            console.error('Error updating expense:', err);
            toast.error('Failed to update expense');
        }
    };

    const formatDate = (date) => {
        const formattedDate = new Date(date);
        return formattedDate.toLocaleDateString('en-US');
    };

    return (
        <ExpenseStyled>
            <InnerLayout>
                <h1>Expenses</h1>
                {error && <p className="error-message">{error}</p>}
                <h2 className="total-expense">Total Expenses: <span>${totalExpenses()}</span></h2>
                <div className="expense-content">
                    <div className="form-container">
                        <form className="expense-form" onSubmit={handleSubmit}>
                            <h3>Add New Expense</h3>
                            <input 
                                type="text" 
                                name="title" 
                                placeholder="Expense Title" 
                                value={newExpense.title}
                                onChange={handleChange}
                                required 
                            />
                            <input 
                                type="number" 
                                name="amount" 
                                placeholder="Amount" 
                                value={newExpense.amount}
                                onChange={handleChange}
                                required 
                            />
                            <input 
                                type="text" 
                                name="category" 
                                placeholder="Category" 
                                value={newExpense.category}
                                onChange={handleChange}
                                required 
                            />
                            <input 
                                type="date" 
                                name="date" 
                                placeholder="Date" 
                                value={newExpense.date}
                                onChange={handleChange}
                                required 
                            />
                            <button type="submit">Add Expense</button>
                        </form>
                    </div>
                    <div className="expenses">
                        {expenses.length === 0 ? (
                            <p>No expense records found</p>
                        ) : (
                            expenses.map((expense) => {
                                const { _id, title, amount, date, category } = expense;
                                return (
                                    <ExpenseItemStyled key={_id} indicatorColor="pink">
                                        <div className="content">
                                            <h5>{title}</h5>
                                            <div className="inner-content">
                                                <div className="text">
                                                    <p>${amount}</p>
                                                    <p>{formatDate(date)}</p>
                                                    <p>{category}</p>
                                                </div>
                                                <div className="btn-con">
                                                    {editingId === _id ? (
                                                        <>
                                                            <input
                                                                type="number"
                                                                placeholder="New Amount"
                                                                value={editAmount}
                                                                onChange={(e) => setEditAmount(e.target.value)}
                                                            />
                                                            <Button icon="✔️" onClick={() => handleEditSubmit(_id)} />
                                                            <Button icon="❌" onClick={() => setEditingId(null)} />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Button icon="✏️" onClick={() => {
                                                                setEditingId(_id);
                                                                setEditAmount(amount);
                                                            }} />
                                                            <Button icon="🗑️" onClick={() => deleteExpense(_id)} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </ExpenseItemStyled>
                                );
                            })
                        )}
                    </div>
                </div>
            </InnerLayout>
        </ExpenseStyled>
    );
}
const ExpenseStyled = styled.div`
    .total-expense {
        background: #FCF6F9;
        border: 2px solid #FFFFFF;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 10px;
        padding: .5rem;
        margin: 1rem 0;
        font-size: 2rem;
        gap: .5rem;
        span {
            font-size: 2.5rem;
            font-weight: 600;
            color: #ff6b6b; /* Adjusted color for expense */
        }
    }
    .expense-content {
        position: relative;
        display: flex;
        gap: 2rem;

        .form-container {
            position: relative;
            left: -250px;
            width: 100%;
            max-width: 400px;
            .expense-form {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                background: #fff;
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.1);
                h3 {
                    text-align: center;
                    color: #4a4a4a;
                }
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
                    background-color: #ff6b6b;
                    color: #fff;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: background-color 0.3s;

                    &:hover {
                        background-color: #d9534f;
                    }
                }
            }
        }

        .expenses {
            position: absolute;
            width: 120%;
            right: -200px;
            top: 0;
            gap: 1rem;
        }
    }
`;

const ExpenseItemStyled = styled.div`
    background: #FCF6F9;
    border: 2px solid #FFFFFF;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: .5rem;
    margin-bottom: 1rem;
    margin-left: 2rem;

    .content {
        display: flex;
        flex-direction: column;
        gap: .2rem;

        h5 {
            font-size: 1.3rem;
            position: relative;
            padding-left: 2rem;
            color: #4a4a4a;
        }

        .inner-content {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .text {
                display: flex;
                align-items: center;
                gap: 1.5rem;
                font-size: 0.9rem;
                color: #555;
            }
        }
    }

    .btn-con {
        display: flex;
        gap: 0.5rem;
    }
`;

export default Expenses;

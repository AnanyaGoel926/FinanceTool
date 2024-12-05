import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import Button from '../Button/Button';
import { toast } from 'react-toastify';

function Income() {
    const { user, addIncome, incomes, getIncomes, deleteIncome, totalIncome, error, setError } = useGlobalContext();
    const [newIncome, setNewIncome] = useState({
        title: '',
        amount: '',
        category: '',
        date: ''
    });

    useEffect(() => {
        if (user) {
            getIncomes(user._id)
                .catch(err => {
                    console.error('Error fetching incomes:', err);
                    toast.error('Failed to load incomes');
                });
        }
    }, [user, getIncomes]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewIncome(prevState => ({
            ...prevState,
            [name]: name === 'amount' ? parseFloat(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (user) {
            try {
                await addIncome({ ...newIncome, userId: user._id });
                setNewIncome({ title: '', amount: '', category: '', date: '' });
                toast.success('Income added successfully');
            } catch (err) {
                console.error('Error adding income:', err);
                toast.error('Failed to add income');
            }
        } else {
            setError('User not found');
            toast.error('User not authenticated');
        }
    };

    const formatDate = (date) => {
        const formattedDate = new Date(date);
        return formattedDate.toLocaleDateString('en-US');
    };

    return (
        <IncomeStyled>
            <InnerLayout>
                <h1>Incomes</h1>
                {error && <p className="error-message">{error}</p>}
                <h2 className="total-income">Total Income: <span>${totalIncome()}</span></h2>
                <div className="income-content">
                    <div className="form-container">
                        <form className="income-form" onSubmit={handleSubmit}>
                            <h3>Add New Income</h3>
                            <input 
                                type="text" 
                                name="title" 
                                placeholder="Income Title" 
                                value={newIncome.title}
                                onChange={handleChange}
                                required 
                            />
                            <input 
                                type="number" 
                                name="amount" 
                                placeholder="Amount" 
                                value={newIncome.amount}
                                onChange={handleChange}
                                required 
                            />
                            <input 
                                type="text" 
                                name="category" 
                                placeholder="Category" 
                                value={newIncome.category}
                                onChange={handleChange}
                                required 
                            />
                            <input 
                                type="date" 
                                name="date" 
                                placeholder="Date" 
                                value={newIncome.date}
                                onChange={handleChange}
                                required 
                            />
                            <button type="submit">Add Income</button>
                        </form>
                    </div>
                    <div className="incomes">
                        {incomes.length === 0 ? (
                            <p>No income records found</p>
                        ) : (
                            incomes.map((income) => {
                                const { _id, title, amount, date, category } = income;
                                return (
                                    <IncomeItemStyled key={_id} indicatorColor="var(--color-green)">
                                        <div className="content">
                                            <h5>{title}</h5>
                                            <div className="inner-content">
                                                <div className="text">
                                                    <p>${amount}</p>
                                                    <p>{formatDate(date)}</p>
                                                    <p>{category}</p>
                                                </div>
                                                <div className="btn-con">
                                                    <Button 
                                                        icon="🗑️"
                                                        onClick={() => deleteIncome(_id)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </IncomeItemStyled>
                                );
                            })
                        )}
                    </div>
                </div>
            </InnerLayout>
        </IncomeStyled>
    );
}
const IncomeStyled = styled.div`
    .total-income {
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
            color: purple;
        }
    }
    .income-content {
        position: relative;
        .form-container {
            position: relative;
            left: -250px;
            width: 100%;
            max-width: 400px;
            .income-form {
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
        .incomes {
            position: absolute;
            width: 120%; 
            right: -200px; 
            top: 0;
            gap: 1rem;
        }
    }
`;

const IncomeItemStyled = styled.div`
    background: #FCF6F9;
    border: 2px solid #FFFFFF;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: .5rem;
    margin-bottom: 1rem;

    .content {
        display: flex;
        flex-direction: column;
        gap: .2rem;

        h5 {
            font-size: 1.3rem;
            position: relative;
            padding-left: 2rem;
        }

        .inner-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .text {
                display: flex;
                align-items: center;
                gap: 1.5rem;
            }
        }
    }
`;

export default Income;

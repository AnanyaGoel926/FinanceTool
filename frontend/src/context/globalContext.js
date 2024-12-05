import React, { createContext, useContext, useState } from "react";
import axios from 'axios';

const BASE_URL = "http://localhost:4642/api/v1/";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

     const clearData = () => {
        setIncomes([]);
        setExpenses([]);
        setBudgets([]);
    };

    const signUp = async (name, email) => {
        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}signup`, { name, email });
            setUser(response.data.user);
            const userId = response.data.user._id;
            getIncomes(userId);
            getExpenses(userId);
            setBudgets([]);
            setLoading(false);
        } catch (err) {
            setError(err.response.data.message);
            setLoading(false);
        }
    };
    
    const signIn = async (email) => {
        try {
            const response = await axios.post(`${BASE_URL}signin`, { email });
            setUser(response.data.user);
            // Load user-specific data
            getIncomes(response.data.user._id);
            getExpenses(response.data.user._id);
            setLoading(false);
        } catch (err) {
            setError(err.response.data.message);
            setLoading(false);
        }
    };

    const loadUserData = async (userId) => {
        try {
            await getIncomes(userId);
            await getExpenses(userId);
            await getBudgets(userId);
        } catch (err) {
            console.error(err);
        }
    };

    const signOut = () => {
        setUser(null);
        setIncomes([]);
        setExpenses([]);
        setBudgets([]);
        setLoading(false);
    };
    const addIncome = async (income) => {
        try {
            const response = await axios.post(`${BASE_URL}add-income`, {
                ...income,
                userId: user._id 
            });
            getIncomes(user._id);
        } catch (error) {
            console.error(error);
        }
    };

    const getIncomes = async (userId) => {
        try {
            const response = await axios.get(`${BASE_URL}get-incomes`, {
                params: { userId }
            });
            setIncomes(response.data);
        } catch (error) {
            console.error(error);
        }
    };
    
    const deleteIncome = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-income/${id}`);
            getIncomes();
        } catch (err) {
            setError(err.response?.data.message || 'Error deleting income');
        }
    };

const addExpense = async (expense) => {
    try {
        const expenseWithUser = {
            ...expense,
            userId: user ? user._id : null
        };
        await axios.post(`${BASE_URL}add-expense`, expenseWithUser);
        getExpenses(user._id);
    } catch (err) {
        setError(err.response?.data.message || 'Error adding expense');
    }
};
        const getExpenses = async (userId) => {
            try {
                const response = await axios.get(`${BASE_URL}get-expenses`, {
                    params: { userId }
                });
                setExpenses(response.data);
            } catch (error) {
                console.error(error);
            }
        };
    

    const deleteExpense = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-expense/${id}`);
            getExpenses();
        } catch (err) {
            setError(err.response?.data.message || 'Error deleting expense');
        }
    };

        const getBudgets = async (userId) => {
            try {
                const response = await axios.get(`${BASE_URL}get-budgets`, {
                    params: { userId }
                });
                setBudgets(response.data);
            } catch (error) {
                console.error(error);
            }
        };
    const totalIncome = () => incomes.reduce((total, income) => total + income.amount, 0);
    const totalExpenses = () => expenses.reduce((total, expense) => total + expense.amount, 0);
    const totalBalance = () => totalIncome() - totalExpenses();

    const transactionHistory = () => {
        const history = [...incomes, ...expenses];
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return history.slice(0, 3);
    };

    return (
        <GlobalContext.Provider value={{
            user,
            setUser,
            signUp,
            signIn,
            signOut,
            incomes,
            addIncome,
            getIncomes,
            deleteIncome,
            expenses,
            addExpense,
            getExpenses,
            deleteExpense,
            budgets,
            getBudgets,
            totalIncome,
            totalExpenses,
            totalBalance,
            transactionHistory,
            error,
            loading,
            clearData,
            loadUserData
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);

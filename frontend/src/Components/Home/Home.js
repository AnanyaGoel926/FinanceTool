import React, { useState } from 'react';
import { useGlobalContext } from '../../context/globalContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [isNewUser, setIsNewUser] = useState(true);
    const [error, setError] = useState('');
    const global = useGlobalContext();
    const { setUser, loadUserData } = global;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const payload = { name, email };
        const url = isNewUser ? 'http://localhost:4642/api/v1/signup' : 'http://localhost:4642/api/v1/signin';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            setUser(data.user);

        if (!isNewUser) {
            await loadUserData(data.user._id);
        }

        toast.success(isNewUser ? 'Account created successfully!' : 'Signed in successfully!');
    } catch (err) {
        setError(err.message);
        toast.error(err.message);
    }
    };

    return (
        <div style={styles.container}>
            <h2>{isNewUser ? 'Create Account' : 'Sign In'}</h2>
            {error && <p style={styles.error}>{error}</p>}
            <form style={styles.form} onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={styles.input}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>
                    {isNewUser ? 'Create Account' : 'Sign In'}
                </button>
            </form>
            <button style={styles.toggleButton} onClick={() => setIsNewUser(!isNewUser)}>
                {isNewUser ? 'Already have an account? Sign In' : 'Need an account? Create one'}
            </button>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '400px',
        margin: '50px auto',
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '10px',
        fontSize: '16px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
    },
    toggleButton: {
        marginTop: '20px',
        fontSize: '14px',
        color: '#007bff',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
    },
    error: {
        color: 'red',
        marginBottom: '10px',
    },
};

export default Home;

import React, { useState } from 'react';
import styled from 'styled-components';
import { signout } from '../../utils/Icons';
import { menuItems } from '../../utils/menuItems';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../context/globalContext';
import { toast } from 'react-toastify';

function Navigation({ active, setActive }) {
    const navigate = useNavigate();
    const { user, setUser } = useGlobalContext();
    const [loading, setLoading] = useState(false); 
    const handleSignOut = () => {
        setUser(null);
        toast.info("Signed out successfully!");
        navigate('/Home');
    };
     const handleDeleteUser = async () => {
        if (user && user._id) {
            const url = `http://localhost:4642/api/v1/user/${user._id}`;
            setLoading(true);
            try {
                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to delete the user');
                }

                setUser(null);
                toast.success("User Deleted successfully!");
                navigate('/Home'); 
            } catch (err) {
                console.error('Error deleting user:', err.message);
            }
        } else {
            console.error('No user found to delete.');
        }
    };
    return (
        <NavStyled>
            <div className="user-con">
                <div className="text">
                    <h2>{user ? user.name : 'Guest'}</h2> 
                    <p>Your Money</p>
                </div>
            </div>
            <ul className="menu-items">
                {menuItems.map((item) => (
                    <li
                        key={item.id}
                        className={active === item.id ? 'active' : ''}
                        onClick={() => {
                            setActive(item.id);}}
                    >
                        <span>{item.title}</span>
                    </li>
                ))}
            </ul>
            <div className="bottom-nav">
                <button className="signout-btn" onClick={handleSignOut}>
                    {signout} Sign Out
                </button>
                <div className="delete-container">
                    <button className="delete-btn" onClick={handleDeleteUser}>
                        Delete User
                    </button>
                    {loading && <SlidingBar />}
                </div>
            </div>
        </NavStyled>
    );
}
const SlidingBar = styled.div`
    width: 100%;
    height: 5px;
    background-color: #4caf50; /* Green color */
    animation: slide 5s forwards; /* Animation for sliding */
    margin-left: 10px; /* Space between button and sliding bar */

    @keyframes slide {
        from {
            width: 0;
        }
        to {
            width: 100%;
        }
    }
`;

const NavStyled = styled.nav`
    padding: 2rem 1.5rem;
    width: 374px;
    height: 100%;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #FFFFFF;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 2rem;

    .user-con {
        height: 100px;
        display: flex;
        align-items: center;
        gap: 1rem;
        img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
            background: #fcf6f9;
            border: 2px solid #FFFFFF;
            padding: .2rem;
            box-shadow: 0px 1px 17px rgba(0, 0, 0, 0.06);
        }
        h2 {
            color: rgba(34, 34, 96, 1);
        }
        p {
            color: rgba(34, 34, 96, .6);
        }
    }

    .menu-items {
        flex: 1;
        display: flex;
        flex-direction: column;
        li {
            display: grid;
            grid-template-columns: 40px auto;
            align-items: center;
            margin: .6rem 0;
            font-weight: 500;
            cursor: pointer;
            transition: all .4s ease-in-out;
            color: rgba(34, 34, 96, .6);
            padding-left: 1rem;
            position: relative;
            i {
                color: rgba(34, 34, 96, 0.6);
                font-size: 1.4rem;
                transition: all .4s ease-in-out;
            }
        }
    }

    .active {
        color: rgba(34, 34, 96, 1) !important;
        i {
            color: rgba(34, 34, 96, 1) !important;
        }
        &::before {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            width: 4px;
            height: 100%;
            background: #222260;
            border-radius: 0 10px 10px 0;
        }
    }

    .bottom-nav {
        .signout-btn, .delete-btn {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 0.5rem;
            background: none;
            border: none;
            color: rgba(34, 34, 96, 0.6);
            font-weight: 500;
            cursor: pointer;
            font-size: 1.1rem;
            transition: color 0.4s ease-in-out;
            i {
                font-size: 1.4rem;
                transition: all .4s ease-in-out;
            }
            &:hover {
                color: rgba(34, 34, 96, 1);
                i {
                    color: rgba(34, 34, 96, 1);
                }
            }
        }
    }
`;

export default Navigation;

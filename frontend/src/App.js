import React, { useState, useMemo } from 'react';
//import { Routes, Route } from 'react-router-dom'; // Import Routes and Route from react-router-dom
import styled from "styled-components";
import { MainLayout } from './styles/Layouts'; 
import Orb from './Components/Orb/Orb';
import Navigation from './Components/Navigation/Navigation';
import Dashboard from './Components/Dashboard/Dashboard';
import Income from './Components/Income/Income';
import Expenses from './Components/Expenses/Expenses';
import Budget from './Components/Budgeting/Budget';
import Home from './Components/Home/Home';
import { useGlobalContext } from './context/globalContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [active, setActive] = useState(1); 
  const global = useGlobalContext();
  const isAuthenticated = global.user; 
  const orbMemo = useMemo(() => {
    return <Orb />;
  }, []);

  return (
    <AppStyled className="App">
      <ToastContainer position="bottom-right" autoClose={3000} />
      {orbMemo}
      <MainLayout>
        {!isAuthenticated ? (
          <main>
            <Home />
          </main>
        ) : (
          <>
            <Navigation active={active} setActive={setActive} />
            <main>
            {active === 1 && <Dashboard />}
              {active === 2 && <Budget />} 
              {active === 3 && <Income />}
              {active === 4 && <Expenses />}
            </main>
          </>
        )}
      </MainLayout>
    </AppStyled>
  );
}

const AppStyled = styled.div`
  height: 100vh;
  background: linear-gradient(135deg, #b392f0 0%, #d3bff0 100%); /* Lighter Purple Gradient */
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  main {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column; /* Stack elements vertically */
    width: 100%;
    max-width: 5000px; /* Increase the width of the white part */
    background: rgba(252, 246, 300, 0.75);
    border: 2px solid #ffffff; 
    backdrop-filter: blur(3px);
    border-radius: 32px;
    padding: 20rem;
    overflow-x: hidden;

    &::-webkit-scrollbar {
      width: 0;
    }
  }
`;

export default App;

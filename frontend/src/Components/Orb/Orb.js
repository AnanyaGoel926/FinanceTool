import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

function Orb() {
    const [windowSize, setWindowSize] = useState([window.innerWidth, window.innerHeight]);

    useEffect(() => {
        const updateSize = () => {
            setWindowSize([window.innerWidth, window.innerHeight]);
        };
        window.addEventListener('resize', updateSize);

        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const width = windowSize[0];
    const height = windowSize[1];

    const moveOrb = keyframes`
        0% {
            transform: translate(0, 0);
        }
        50% {
            transform: translate(${width / 3}px, ${height / 4}px); 
        }
        100% {
            transform: translate(0, 0);
        }
    `;

    const OrbStyled = styled.div`
        width: 70vh;
        height: 70vh;
        position: absolute;
        border-radius: 50%;
        margin-left: -37vh;
        margin-top: -37vh;
        background: linear-gradient(180deg, #F56692 0%, #F2994A 100%);
        filter: blur(400px);
        animation: ${moveOrb} 15s alternate linear infinite;
    `;
    return <OrbStyled />;
}

export default Orb;

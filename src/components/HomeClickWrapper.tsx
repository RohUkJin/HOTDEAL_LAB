'use client';

import styled from 'styled-components';

export default function HomeClickWrapper({ children }: { children: React.ReactNode }) {
    const handleClick = () => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('resetDashboard'));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <Wrapper onClick={handleClick}>
            {children}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
`;

'use client';

import styled, { keyframes, css } from 'styled-components';

export default function SkeletonCard() {
    return (
        <CardWrapper>
            <SkeletonItem>
                <ImagePlaceholder />
                <ContentPlaceholder>
                    <TitleLine />
                    <TitleLine style={{ width: '80%' }} />
                    <PriceLine />
                    <InfoLine />
                </ContentPlaceholder>
            </SkeletonItem>
        </CardWrapper>
    );
}

const shimmer = keyframes`
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
`;

const skeletonAnimation = css`
    background: linear-gradient(90deg, var(--secondary) 25%, var(--border) 37%, var(--secondary) 63%);
    background-size: 200% 100%;
    animation: ${shimmer} 1.5s infinite linear;
`;

const CardWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 400px;
    gap: 8px;

    @media (max-width: 640px) {
        min-height: 106px;
    }
`;

const SkeletonItem = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    background-color: var(--card-bg);
    border: 1px solid var(--border);
    overflow: hidden;

    @media (max-width: 640px) {
        flex-direction: row;
        height: 106px;
    }
`;

const ImagePlaceholder = styled.div`
    width: 100%;
    height: 200px;
    ${skeletonAnimation}
    border-bottom: 1px solid var(--border);

    @media (max-width: 640px) {
        width: 106px;
        min-width: 106px;
        height: 106px;
        border-bottom: none;
        border-right: 1px solid var(--border);
        border-radius: 12px 0 0 12px;
    }
`;

const ContentPlaceholder = styled.div`
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 1;

    @media (max-width: 640px) {
        padding: 10px;
        gap: 8px;
        justify-content: center;
    }
`;

const TitleLine = styled.div`
    height: 20px;
    width: 100%;
    border-radius: 4px;
    ${skeletonAnimation}

    @media (max-width: 640px) {
        height: 14px;
    }
`;

const PriceLine = styled.div`
    height: 30px;
    width: 60%;
    border-radius: 4px;
    margin-top: 10px;
    ${skeletonAnimation}

    @media (max-width: 640px) {
        height: 20px;
        margin-top: 4px;
    }
`;

const InfoLine = styled.div`
    height: 20px;
    width: 40%;
    border-radius: 4px;
    margin-top: auto;
    ${skeletonAnimation}

    @media (max-width: 640px) {
        height: 16px;
        margin-top: auto;
    }
`;

'use client';

import { useState, useEffect, useRef } from 'react';
import { incrementReportCount } from '@/app/actions';
import CustomAlert from './CustomAlert';
import styled from 'styled-components';
import { addReportedItem, isItemReported } from '@/utils/storage';
import { getStoreNameFromUrl } from '@/utils/accessibility';
import { formatPrice, getDisplayPrice, cleanTitle } from '@/utils/format';

interface TotalCardProps {
    item: any;
    disableMobileStyle?: boolean;
}

export default function TotalCard({ item, disableMobileStyle = false }: TotalCardProps) {
    const [isReported, setIsReported] = useState(false);
    const [isAiExpanded, setIsAiExpanded] = useState(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const reportLockRef = useRef(false);

    useEffect(() => {
        if (isItemReported(item.id)) {
            setIsReported(true);
        }
    }, [item.id]);

    const getPlatformName = (link: string) => {
        if (!link) return null;
        if (link.includes('naver')) return '네이버';
        if (link.includes('hyundai')) return '현대';
        if (link.includes('aliexpress')) return '알리익스프레스';
        if (link.includes('himart')) return '하이마트';
        if (link.includes('gsshop')) return 'GS샵';
        if (link.includes('cjthemarket')) return 'CJ더마켓';
        if (link.includes('kakao')) return '카카오';
        if (link.includes('auction')) return '옥션';
        if (link.includes('11st')) return '11번가';
        if (link.includes('coupang')) return '쿠팡';
        if (link.includes('gmarket')) return '지마켓';
        if (link.includes('lotte')) return '롯데온';
        if (link.includes('toss')) return '토스';
        if (link.includes('ohou')) return '오늘의집';
        if (link.includes('wemakeprice')) return '위메프';
        if (link.includes('tmon')) return '티몬';
        if (link.includes('ssg')) return '신세계';
        if (link.includes('cjmall')) return 'CJ';
        if (link.includes('thirtymall')) return '떠리몰';
        return '상품';
    }

    const platformName = getPlatformName(item.link || item.url);
    const iconSrc = null;

    const getNumericValue = (val: any) => Number(String(val || '0').replace(/[^0-9]/g, ''));
    const isLargePrice = getNumericValue(item.discount_price) >= 1000000 || getNumericValue(item.savings) >= 1000000;

    const handleReport = async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (reportLockRef.current || isReported) return;
        reportLockRef.current = true;

        setAlertMessage('신고가 접수되었습니다. 감사합니다.');

        setIsReported(true);
        addReportedItem(item.id);

        try {
            await incrementReportCount(item.id);
        } catch (error) {
            console.error("Report failed:", error);
        }
    };

    return (
        <>
            {alertMessage && <CustomAlert message={alertMessage} onClose={() => setAlertMessage(null)} />}
            <CardWrapper $isReported={isReported}>
                <Item
                    $disableMobileStyle={disableMobileStyle}
                    href={isReported ? undefined : (item.link || item.url)}
                    as={isReported ? 'div' : 'a'}
                    target={isReported ? undefined : "_blank"}
                    rel={isReported ? undefined : "noopener noreferrer"}
                    onClick={(e: React.MouseEvent) => isReported && e.preventDefault()}
                >
                    <PlatformIconWrapper $disableMobileStyle={disableMobileStyle}>
                        {platformName ? (
                            <PlatformText>{platformName}</PlatformText>
                        ) : (
                            iconSrc && <PlatformIcon src={iconSrc} alt={`${getStoreNameFromUrl(item.link || item.url)} 로고`} />
                        )}
                    </PlatformIconWrapper>
                    <ItemContent $disableMobileStyle={disableMobileStyle}>
                        <ItemTitle>{cleanTitle(item.title)}</ItemTitle>
                        <ItemPrice $disableMobileStyle={disableMobileStyle} $isLarge={isLargePrice}>
                            <p>{getDisplayPrice(item.discount_price, item.title)}</p>
                            <SavingsText $isLarge={isLargePrice}>
                                정가 대비 {item.savings ? `${formatPrice(item.savings).replace('원', '')}원 ↓` : '가격 정보 없음'}
                            </SavingsText>
                        </ItemPrice>
                        <ItemInfo>
                            <p>커뮤니티 추천 {item.votes}</p>
                            <p>커뮤니티 댓글 {item.comment_count}</p>
                        </ItemInfo>
                    </ItemContent>
                    <AIContent>
                        <AIContentTitle
                            $disableMobileStyle={disableMobileStyle}
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsAiExpanded(!isAiExpanded); }}
                        >
                            AI 분석 🦾 <ToggleIcon $disableMobileStyle={disableMobileStyle} $isExpanded={isAiExpanded}>▼</ToggleIcon>
                        </AIContentTitle>
                        <AIContentBodyWrapper $isExpanded={isAiExpanded} $disableMobileStyle={disableMobileStyle}>
                            <AIContentBody>
                                <p>• 점수 : {item.score}점/10점</p>
                                <p>• 추천 : {item.ai_summary}</p>
                            </AIContentBody>
                        </AIContentBodyWrapper>
                    </AIContent>

                    {isReported && (
                        <ReportedOverlay>
                            <span>신고됨</span>
                        </ReportedOverlay>
                    )}
                </Item>
                <ReportButton
                    $disableMobileStyle={disableMobileStyle}
                    onClick={handleReport}
                    disabled={isReported}
                    style={{ visibility: isReported ? 'hidden' : 'visible' }}
                    aria-label="가격 변동 또는 종료 신고"
                >
                    변동/종료 신고
                </ReportButton>
            </CardWrapper>
        </>
    );
}

const CardWrapper = styled.div<{ $isReported?: boolean }>`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    gap: 8px;

    ${props => props.$isReported && `
        opacity: 0.6;
        pointer-events: none;
        filter: grayscale(100%);
    `}
`;

const ReportButton = styled.button<{ $disableMobileStyle?: boolean }>`
    background: none;
    border: none;
    color: #888;
    font-size: 11px;
    cursor: pointer;
    align-self: flex-end; 
    padding: 4px 0;
    opacity: 0.8;
    transition: all 0.2s ease-in-out;
    
    &:hover {
        text-decoration: underline;
        color: var(--text-primary);
    }

    ${props => !props.$disableMobileStyle && `
        @media (max-width: 768px) {
            padding: 2px 0;
        }
    `}
`;

const Item = styled.a<{ $disableMobileStyle?: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    height: 100%;
    min-height: 400px;
    border-radius: 12px;
    background-color: var(--card-bg);
    align-items: center;
    border: 1px solid var(--border);
    cursor: pointer;
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative; 
    overflow: hidden;
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    }

    ${props => !props.$disableMobileStyle && `
        @media (max-width: 640px) {
            min-height: 180px;
        }
    `}
`;

const ReportedOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.4);
    z-index: 20;
    
    span {
        color: #fff;
        font-weight: 500;
        font-size: 18px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        border: 2px solid #fff;
        padding: 8px 16px;
        border-radius: 8px;
    }
`;

const PlatformIconWrapper = styled.div<{ $disableMobileStyle?: boolean }>`
    width: 100%;
    height: 150px;
    min-height: 200px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    background-color: var(--platform-bg);
    position: relative;

    ${props => !props.$disableMobileStyle && `
        @media (max-width: 640px) {
            display: none;
        }
    `}
`;

const PlatformIcon = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
`;

const PlatformText = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--platform-bg);
    color: var(--platform-text);
    font-size: 40px;
    font-family: var(--font-bmhanna);
    border-bottom: 1px solid var(--border);
`;


const ItemContent = styled.div<{ $disableMobileStyle?: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    padding: 10px;

    ${props => !props.$disableMobileStyle && `
        @media (max-width: 640px) {
            gap: 15px;
        }
    `}
`;

const ItemTitle = styled.h3`
    font-size: 16px;
    line-height: 1.4;
    font-weight: 700;
    color: var(--text-primary);
    height: 42px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
`;

const ItemPrice = styled.div<{ $disableMobileStyle?: boolean; $isLarge?: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 14px;
    font-size: ${props => props.$isLarge ? '24px' : '26px'};
    font-weight: 700;
    color: #e53935;

    ${props => !props.$disableMobileStyle && `
        @media (max-width: 640px) {
            flex-direction: row;
            justify-content: space-between;
        }
    `}
`;

const ItemInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
   
    p {
        font-size: 12px;
        font-weight: 500;
        color: #fff;
        border-radius: 4px;
        padding: 4px 8px;
        background: #006239;
    }   
`;

const SavingsText = styled.div<{ $isLarge?: boolean }>`
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: ${props => props.$isLarge ? '9px' : '11px'};
    font-weight: 700;
    color: var(--text-secondary);
    opacity: 0.8;
`;

const AIContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    height: 100%;
    padding: 10px;
`;

const AIContentTitle = styled.h4<{ $disableMobileStyle?: boolean }>`
    font-size: 13px;
    font-weight: 700;
    color: var(--text-primary);

    ${props => !props.$disableMobileStyle && `
        @media (max-width: 640px) {
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 4px 0;
        }
    `}
`;

const ToggleIcon = styled.span<{ $disableMobileStyle?: boolean; $isExpanded?: boolean }>`
    display: none;
    font-size: 10px;
    color: var(--text-secondary);
    transition: transform 0.3s ease;
    
    ${props => !props.$disableMobileStyle && `
        @media (max-width: 640px) {
            display: inline-block;
            transform: ${props.$isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'};
        }
    `}
`;

const AIContentBodyWrapper = styled.div<{ $isExpanded: boolean; $disableMobileStyle?: boolean }>`
    display: block;
    overflow: hidden;
    transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out, margin-top 0.3s ease-in-out;
    max-height: 500px;
    opacity: 1;
    
    ${props => !props.$disableMobileStyle && `
        @media (max-width: 640px) {
            max-height: ${props.$isExpanded ? '500px' : '0'};
            opacity: ${props.$isExpanded ? '1' : '0'};
            margin-top: ${props.$isExpanded ? '4px' : '0'};
        }
    `}
`;

const AIContentBody = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-left: 6px;
    font-size: 12.4px;
    line-height: 1.4;
    font-weight: 500;
    color: var(--text-secondary);
`;

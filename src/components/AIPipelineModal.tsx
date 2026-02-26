import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

interface AIPipelineModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AIPipelineModal({ isOpen, onClose }: AIPipelineModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <Overlay
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <ModalContainer
                    onClick={(e) => e.stopPropagation()}
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                >
                    <CloseButton onClick={onClose}>✕</CloseButton>
                    <Header>
                        <Title>✨ AI 맞춤 추천은 어떻게 작동하나요?</Title>
                        <Subtitle>핫딜 연구소가 완벽한 상품을 찾아내는 4단계 과정</Subtitle>
                    </Header>

                    <PipelineGrid>
                        <StepCard>
                            <StepNumber>1</StepNumber>
                            <StepIcon>💬</StepIcon>
                            <StepTitle>질문 입력</StepTitle>
                            <StepDesc>사용자가 원하는 핫딜 조건을 자연어로 자유롭게 입력합니다.</StepDesc>
                        </StepCard>

                        <Arrow>➔</Arrow>

                        <StepCard>
                            <StepNumber>2</StepNumber>
                            <StepIcon>🧠</StepIcon>
                            <StepTitle>AI 분석 및 768차원 벡터 변환</StepTitle>
                            <StepDesc>Gemini AI(2.5 Flash)가 문맥을 파악해 적합한 카테고리를 찾고, 사용자의 입력 의도를 768차원 벡터(Vector)값으로 변환하여 검색 준비를 합니다.</StepDesc>
                        </StepCard>

                        <Arrow>➔</Arrow>

                        <StepCard>
                            <StepNumber>3</StepNumber>
                            <StepIcon>🔍</StepIcon>
                            <StepTitle>의미론적 유사도(Semantic) 검색</StepTitle>
                            <StepDesc>단순 단어 매칭이 아닌, 단어의 숨은 의미와 맥락을 AI 유사도 분석으로 정밀하게 매칭하여 사용자의 의도에 완벽하게 부합하는 핫딜을 찾아옵니다.</StepDesc>
                        </StepCard>

                        <Arrow>➔</Arrow>

                        <StepCard>
                            <StepNumber>4</StepNumber>
                            <StepIcon>🎁</StepIcon>
                            <StepTitle>맞춤 핫딜 제공</StepTitle>
                            <StepDesc>중복된 딜을 제거한 최정예 핫딜들을 선별하여, 다정한 AI 코멘트와 함께 사용자에게 제공합니다.</StepDesc>
                        </StepCard>
                    </PipelineGrid>

                    <BottomNote>
                        💡 키워드가 조금 상이하거나 은유적인 표현이더라도, AI가 숨은 의미를 파악하여 가장 연관성이 높은 최적의 아이템을 똑똑하게 추천합니다.
                    </BottomNote>
                </ModalContainer>
            </Overlay>
        </AnimatePresence>
    );
}

const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
`;

const ModalContainer = styled(motion.div)`
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 40px;
    width: 90%;
    max-width: 900px;
    position: relative;
    box-shadow: 0 24px 48px rgba(0,0,0,0.4);
    color: var(--text-primary);
`;

const CloseButton = styled.button`
    position: absolute;
    top: 24px;
    right: 24px;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 20px;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
        color: var(--text-primary);
    }
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: 40px;
`;

const Title = styled.h2`
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 12px;
    background: linear-gradient(90deg, #00c853, #69f0ae);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
    font-size: 16px;
    color: var(--text-secondary);
`;

const PipelineGrid = styled.div`
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    gap: 16px;

    @media (max-width: 900px) {
        flex-direction: column;
        gap: 20px;
        align-items: center;
    }
`;

const Arrow = styled.div`
    color: var(--primary);
    font-size: 24px;
    align-self: center;
    opacity: 0.5;

    @media (max-width: 900px) {
        transform: rotate(90deg);
        margin: -8px 0;
    }
`;

const StepCard = styled.div`
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    flex: 1;
    position: relative;
    transition: transform 0.3s, background 0.3s, box-shadow 0.3s;

    @media (max-width: 900px) {
        width: 100%;
        padding: 20px 16px;
    }

    &:hover {
        transform: translateY(-5px);
        background: rgba(0, 200, 83, 0.08);
        border-color: rgba(0, 200, 83, 0.4);
        box-shadow: 0 8px 16px rgba(0, 200, 83, 0.15);
    }
`;

const StepNumber = styled.div`
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--primary);
    color: #000;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 800;
    box-shadow: 0 4px 8px rgba(0, 200, 83, 0.4);
`;

const StepIcon = styled.div`
    font-size: 40px;
    margin-bottom: 16px;
    margin-top: 8px;
    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
`;

const StepTitle = styled.h3`
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 12px;
    color: var(--text-primary);
`;

const StepDesc = styled.p`
    font-size: 14.5px;
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.6;
    word-break: keep-all;
    font-weight: 400;
`;

const BottomNote = styled.div`
    margin-top: 32px;
    text-align: center;
    font-size: 15px;
    font-weight: 500;
    color: #e0e0e0;
    background: rgba(0, 200, 83, 0.1);
    padding: 18px 20px;
    border-radius: 12px;
    border: 1px solid rgba(0, 200, 83, 0.2);
    word-break: keep-all;
    line-height: 1.5;
`;


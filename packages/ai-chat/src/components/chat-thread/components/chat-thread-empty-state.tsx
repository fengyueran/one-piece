import styled from '@emotion/styled'

export const ChatThreadEmptyState = () => {
  return (
    <EmptyShell data-testid="chat-empty-hero">
      <HeroMark>
        <HeroOrbit />
        <HeroCore>AI</HeroCore>
      </HeroMark>
      <HeroTitle>Ask anything</HeroTitle>
    </EmptyShell>
  )
}

const EmptyShell = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
  padding: 48px 24px 24px;
`

const HeroMark = styled.div`
  position: relative;
  width: 108px;
  height: 108px;
  border-radius: 24px;
  display: grid;
  place-items: center;
`

const HeroOrbit = styled.div`
  position: absolute;
  inset: 20px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow:
    0 0 24px rgba(78, 102, 255, 0.3),
    inset 0 0 16px rgba(255, 255, 255, 0.08);

  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    inset: -7px;
    border: 1px solid rgba(78, 102, 255, 0.12);
  }

  &::after {
    inset: 8px -10px;
    transform: rotate(-22deg);
  }
`

const HeroCore = styled.div`
  position: relative;
  z-index: 1;
  font-size: 28px;
  line-height: 1;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: rgba(242, 244, 255, 0.96);
  text-shadow: 0 0 16px rgba(98, 116, 255, 0.65);
`

const HeroTitle = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 16px;
  line-height: 24px;
`

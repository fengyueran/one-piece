import styled from '@emotion/styled'

export interface PDEAINoticeCardProps {
  text: string
  tone: 'info' | 'warning' | 'success'
}

export const PDEAINoticeCard = ({ text, tone }: PDEAINoticeCardProps) => (
  <Card data-testid="pde-ai-notice-card" data-tone={tone}>
    {text}
  </Card>
)

const Card = styled.div`
  padding: 12px 14px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  line-height: 1.5;

  &[data-tone='info'] {
    border-color: rgba(105, 170, 255, 0.26);
    background: rgba(68, 118, 255, 0.12);
  }

  &[data-tone='warning'] {
    border-color: rgba(255, 193, 92, 0.28);
    background: rgba(255, 181, 71, 0.12);
  }

  &[data-tone='success'] {
    border-color: rgba(84, 214, 160, 0.28);
    background: rgba(43, 182, 120, 0.12);
  }
`

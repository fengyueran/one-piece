import styled from '@emotion/styled'
import type { ResultSummary } from '../../../types'

export interface ResultSummaryCardProps {
  summary: ResultSummary
}

export const ResultSummaryCard = ({ summary }: ResultSummaryCardProps) => (
  <Card data-testid="result-summary-card" data-status={summary.status}>
    <Eyebrow>{summary.status}</Eyebrow>
    <Headline>{summary.headline}</Headline>
    <Details>
      {summary.details.map((detail) => (
        <Detail key={detail}>{detail}</Detail>
      ))}
    </Details>
  </Card>
)

const Card = styled.section`
  display: grid;
  gap: 10px;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);

  &[data-status='completed'] {
    border-color: rgba(84, 214, 160, 0.26);
  }

  &[data-status='failed'] {
    border-color: rgba(255, 122, 122, 0.24);
  }
`

const Eyebrow = styled.span`
  color: rgba(255, 255, 255, 0.58);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

const Headline = styled.strong`
  color: rgba(255, 255, 255, 0.94);
  font-size: 15px;
`

const Details = styled.ul`
  margin: 0;
  padding-left: 18px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
`

const Detail = styled.li`
  & + & {
    margin-top: 6px;
  }
`

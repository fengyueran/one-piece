import styled from '@emotion/styled'
import type { ChatParameterSummaryItem } from '../../../types'

export interface PDEAIParameterSummaryCardProps {
  items: ChatParameterSummaryItem[]
}

export const PDEAIParameterSummaryCard = ({ items }: PDEAIParameterSummaryCardProps) => (
  <Card data-testid="pde-ai-parameter-summary-card">
    <Title>Parameter Summary</Title>
    <List>
      {items.map((item) => (
        <ListItem key={`${item.fieldPath ?? item.label}-${item.value}`}>
          <Label>{item.label}</Label>
          <Value>{item.value}</Value>
        </ListItem>
      ))}
    </List>
  </Card>
)

const Card = styled.section`
  padding: 14px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
`

const Title = styled.div`
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.62);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

const List = styled.div`
  display: grid;
  gap: 10px;
`

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
`

const Label = styled.span`
  color: rgba(255, 255, 255, 0.72);
  font-size: 13px;
`

const Value = styled.span`
  color: rgba(255, 255, 255, 0.94);
  font-size: 13px;
  font-weight: 600;
  text-align: right;
`

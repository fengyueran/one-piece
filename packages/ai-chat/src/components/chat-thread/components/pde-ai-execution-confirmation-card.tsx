import styled from '@emotion/styled'
import type { ExecutionProposal } from '../../../types'

export interface PDEAIExecutionConfirmationCardProps {
  proposal: ExecutionProposal
  interactive?: boolean
  onApply?: () => void
  onConfirm?: () => void
  onRevise?: () => void
}

export const PDEAIExecutionConfirmationCard = ({
  proposal,
  interactive = false,
  onApply,
  onConfirm,
  onRevise,
}: PDEAIExecutionConfirmationCardProps) => {
  return (
    <Card data-testid="pde-ai-execution-confirmation-card">
      <Header>
        <Eyebrow>Execution Proposal</Eyebrow>
        <Title>{proposal.equationName}</Title>
        {proposal.solverName ? <Subtitle>{proposal.solverName}</Subtitle> : null}
      </Header>
      <SummaryList>
        {proposal.parameterSummary.map((item) => (
          <SummaryItem key={`${item.fieldPath ?? item.label}-${item.value}`}>
            <SummaryLabel>{item.label}</SummaryLabel>
            <SummaryValue>{item.value}</SummaryValue>
          </SummaryItem>
        ))}
      </SummaryList>
      {proposal.warnings?.length ? (
        <Warnings>
          {proposal.warnings.map((warning) => (
            <Warning key={warning}>{warning}</Warning>
          ))}
        </Warnings>
      ) : null}
      {interactive ? (
        <Actions>
          {onApply && (
            <ActionButton type="button" data-testid="pde-ai-confirmation-apply" onClick={onApply}>
              Apply to Parameters
            </ActionButton>
          )}
          {onConfirm && (
            <ActionButton
              type="button"
              data-testid="pde-ai-confirmation-confirm"
              onClick={onConfirm}
            >
              Confirm Execution
            </ActionButton>
          )}
          {onRevise && (
            <SecondaryActionButton
              type="button"
              data-testid="pde-ai-confirmation-revise"
              onClick={onRevise}
            >
              Revise Plan
            </SecondaryActionButton>
          )}
        </Actions>
      ) : null}
    </Card>
  )
}

const Card = styled.section`
  display: grid;
  gap: 14px;
  padding: 16px;
  border-radius: 20px;
  border: 1px solid rgba(126, 160, 255, 0.2);
  background:
    linear-gradient(180deg, rgba(73, 98, 188, 0.16) 0%, rgba(31, 35, 47, 0.42) 100%),
    rgba(255, 255, 255, 0.03);
`

const Header = styled.div`
  display: grid;
  gap: 4px;
`

const Eyebrow = styled.span`
  color: rgba(255, 255, 255, 0.58);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

const Title = styled.strong`
  color: rgba(255, 255, 255, 0.95);
  font-size: 16px;
  line-height: 1.4;
`

const Subtitle = styled.span`
  color: rgba(255, 255, 255, 0.68);
  font-size: 13px;
`

const SummaryList = styled.div`
  display: grid;
  gap: 8px;
`

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
`

const SummaryLabel = styled.span`
  color: rgba(255, 255, 255, 0.72);
  font-size: 13px;
`

const SummaryValue = styled.span`
  color: rgba(255, 255, 255, 0.94);
  font-size: 13px;
  font-weight: 600;
`

const Warnings = styled.div`
  display: grid;
  gap: 8px;
`

const Warning = styled.div`
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(255, 193, 92, 0.24);
  background: rgba(255, 181, 71, 0.12);
  color: rgba(255, 241, 211, 0.92);
  font-size: 13px;
`

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`

const ActionButton = styled.button`
  border: none;
  border-radius: 999px;
  background: linear-gradient(180deg, #7ea0ff 0%, #4a6fff 100%);
  color: #081127;
  font-size: 12px;
  font-weight: 700;
  padding: 10px 14px;
  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: 0.48;
  }
`

const SecondaryActionButton = styled(ActionButton)`
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.14);
`

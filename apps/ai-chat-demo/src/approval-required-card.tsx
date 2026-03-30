import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Button } from '@xinghunm/compass-ui'

type ApprovalRequiredPayload = {
  request_id: string
  session_id: string
  mode: string
  tool_name: string
  tool_input: string
  timeout_sec: number
}

const cardStyle: CSSProperties = {
  display: 'grid',
  gap: 12,
  padding: 16,
  borderRadius: 16,
  border: '1px solid rgba(31, 82, 240, 0.28)',
  background: 'linear-gradient(180deg, rgba(14, 22, 44, 0.96) 0%, rgba(10, 16, 30, 0.96) 100%)',
  boxShadow: '0 18px 48px rgba(5, 10, 20, 0.28)',
}

const eyebrowStyle: CSSProperties = {
  margin: 0,
  fontSize: 12,
  lineHeight: '16px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#8ab4ff',
}

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 18,
  lineHeight: '24px',
  fontWeight: 700,
  color: '#f8fbff',
}

const summaryGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
  gap: 10,
}

const summaryItemStyle: CSSProperties = {
  padding: 12,
  borderRadius: 12,
  background: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
}

const summaryLabelStyle: CSSProperties = {
  margin: '0 0 4px 0',
  fontSize: 12,
  lineHeight: '16px',
  color: '#93a4bf',
}

const summaryValueStyle: CSSProperties = {
  margin: 0,
  fontSize: 14,
  lineHeight: '20px',
  fontWeight: 600,
  color: '#f8fbff',
  wordBreak: 'break-word',
}

const codeBlockStyle: CSSProperties = {
  margin: 0,
  padding: 12,
  overflowX: 'auto',
  borderRadius: 12,
  background: 'rgba(3, 8, 18, 0.82)',
  border: '1px solid rgba(138, 180, 255, 0.12)',
  color: '#d7e6ff',
  fontSize: 13,
  lineHeight: '18px',
}

const footerStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  alignItems: 'center',
}

const badgeStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '6px 10px',
  borderRadius: 999,
  background: 'rgba(138, 180, 255, 0.12)',
  color: '#d7e6ff',
  fontSize: 12,
  lineHeight: '16px',
  fontWeight: 600,
}

const actionRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 12,
  alignItems: 'center',
  justifyContent: 'space-between',
}

const actionGroupStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10,
}

const hintStyle: CSSProperties = {
  margin: 0,
  fontSize: 12,
  lineHeight: '16px',
  color: '#93a4bf',
}

const truncateValue = (value: string, maxLength = 64) =>
  value.length > maxLength ? `${value.slice(0, maxLength)}...` : value

export const ApprovalRequiredCard = ({ payload }: { payload: ApprovalRequiredPayload }) => {
  const [decision, setDecision] = useState<'approved' | 'rejected' | null>(null)

  const statusLabel =
    decision === 'approved'
      ? 'Approved in demo shell'
      : decision === 'rejected'
        ? 'Rejected in demo shell'
        : 'Waiting for a local demo decision'

  return (
    <section style={cardStyle}>
      <div>
        <p style={eyebrowStyle}>Approval Required</p>
        <h3 style={titleStyle}>Tool execution is waiting for approval</h3>
      </div>

      <div style={summaryGridStyle}>
        <div style={summaryItemStyle}>
          <p style={summaryLabelStyle}>Tool</p>
          <p style={summaryValueStyle}>{payload.tool_name}</p>
        </div>
        <div style={summaryItemStyle}>
          <p style={summaryLabelStyle}>Mode</p>
          <p style={summaryValueStyle}>{payload.mode}</p>
        </div>
        <div style={summaryItemStyle}>
          <p style={summaryLabelStyle}>Timeout</p>
          <p style={summaryValueStyle}>{payload.timeout_sec}s</p>
        </div>
      </div>

      <div>
        <p style={summaryLabelStyle}>Tool Input</p>
        <pre style={codeBlockStyle}>{payload.tool_input}</pre>
      </div>

      <div style={actionRowStyle}>
        <div style={actionGroupStyle}>
          <Button
            variant="primary"
            disabled={decision !== null}
            onClick={() => setDecision('approved')}
          >
            Approve
          </Button>
          <Button disabled={decision !== null} danger onClick={() => setDecision('rejected')}>
            Reject
          </Button>
        </div>
        <p style={hintStyle}>{statusLabel}</p>
      </div>

      <div style={footerStyle}>
        <span style={badgeStyle}>Request: {truncateValue(payload.request_id)}</span>
        <span style={badgeStyle}>Session: {truncateValue(payload.session_id)}</span>
      </div>
    </section>
  )
}

export type { ApprovalRequiredPayload }

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'
import styled from '@emotion/styled'
import { InputField } from '@xinghunm/compass-ui'
import type { PlanQuestion, PlanQuestionnaire, PlanQuestionnaireSubmission } from '../../../types'
import {
  createInitialAnswers,
  createInitialOtherDrafts,
  getMultiSelectDraftState,
  getNumberInputValue,
  getOptionChoiceLabel,
  getQuestionnaireStateKey,
  getSingleSelectDraftState,
  getTextInputValue,
  getMissingRequiredQuestions,
  OTHER_OPTION_VALUE,
  prepareQuestionnaireSubmission,
  toggleMultiSelectAnswer,
  toggleMultiSelectOtherAnswer,
  type QuestionnaireAnswers,
  type QuestionnaireOtherDrafts,
  updateAnswerValue,
} from './questionnaire-card-helpers'

export interface QuestionnaireCardProps {
  questionnaire: PlanQuestionnaire
  interactive?: boolean
  onSubmit?: (submission: PlanQuestionnaireSubmission) => Promise<void> | void
  labels?: Partial<QuestionnaireCardLabels>
}

interface QuestionnaireCardLabels {
  submitting: string
  submitted: string
  validationPrefix: string
  submitFailed: string
  multiSelectHint: string
  otherOptionLabel: string
  otherPlaceholder: string
}

const DEFAULT_QUESTIONNAIRE_CARD_LABELS: QuestionnaireCardLabels = {
  submitting: 'Submitting...',
  submitted: 'Selection submitted. Waiting for the plan to continue...',
  validationPrefix: 'Please complete:',
  submitFailed: 'Failed to submit. Please try again.',
  multiSelectHint: 'Multiple choice',
  otherOptionLabel: 'Other',
  otherPlaceholder: 'Other',
}

const stopInputClickPropagation = (event: MouseEvent<HTMLInputElement>) => {
  event.stopPropagation()
}

const stopInputKeyPropagation = (event: KeyboardEvent<HTMLInputElement>) => {
  event.stopPropagation()
}

interface OptionChoiceProps {
  questionId: string
  optionLabel: string
  index: number
  isSelected: boolean
  isInteractionLocked: boolean
  onClick: () => void
  inlineInput?: ReactNode
  tone?: 'default' | 'other'
}

const OptionChoice = ({
  questionId,
  optionLabel,
  index,
  isSelected,
  isInteractionLocked,
  onClick,
  inlineInput,
  tone = 'default',
}: OptionChoiceProps) => (
  <OptionChoiceItem
    role="button"
    tabIndex={isInteractionLocked ? -1 : 0}
    aria-pressed={isSelected}
    data-selected={isSelected}
    data-tone={tone}
    data-testid={`question-option-${questionId}-${index}`}
    onClick={(event) => {
      if (isInteractionLocked) {
        return
      }

      if (event.target instanceof HTMLElement && event.target.closest('input')) {
        return
      }

      onClick()
    }}
    onKeyDown={(event) => {
      if (isInteractionLocked) {
        return
      }

      if (event.key !== 'Enter' && event.key !== ' ') {
        return
      }

      event.preventDefault()
      onClick()
    }}
  >
    <OptionChoiceMarker data-selected={isSelected}>
      {getOptionChoiceLabel(index)}
    </OptionChoiceMarker>
    <OptionChoiceContent>
      {inlineInput ? null : <OptionChoiceLabel>{optionLabel}</OptionChoiceLabel>}
      {inlineInput}
    </OptionChoiceContent>
  </OptionChoiceItem>
)

const QuestionnaireCardInner = ({
  questionnaire,
  interactive = false,
  onSubmit,
  labels,
}: QuestionnaireCardProps) => {
  const questionnaireRef = useRef(questionnaire)
  const otherInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(() =>
    createInitialAnswers(questionnaire),
  )
  const [otherDrafts, setOtherDrafts] = useState<QuestionnaireOtherDrafts>(() =>
    createInitialOtherDrafts(questionnaire),
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [pendingFocusQuestionId, setPendingFocusQuestionId] = useState<string | null>(null)
  const resolvedLabels = {
    ...DEFAULT_QUESTIONNAIRE_CARD_LABELS,
    ...labels,
  }
  const hasExternalFailureStatus =
    questionnaire.status === 'expired' || questionnaire.status === 'failed'
  const visibleErrorMessage = questionnaire.statusMessage ?? errorMessage
  const isInteractionLocked =
    !interactive || isSubmitting || isSubmitted || hasExternalFailureStatus

  questionnaireRef.current = questionnaire

  useEffect(() => {
    setAnswers(createInitialAnswers(questionnaireRef.current))
    setOtherDrafts(createInitialOtherDrafts(questionnaireRef.current))
  }, [questionnaire.answers])

  useEffect(() => {
    if (!pendingFocusQuestionId || isInteractionLocked) {
      return
    }

    const inputElement = otherInputRefs.current[pendingFocusQuestionId]
    if (!inputElement) {
      return
    }

    inputElement.focus()
    setPendingFocusQuestionId(null)
  }, [isInteractionLocked, pendingFocusQuestionId])

  const handleSubmit = async () => {
    if (isSubmitting || isSubmitted) {
      return
    }

    const missingQuestions = getMissingRequiredQuestions(questionnaire, answers, otherDrafts)

    if (missingQuestions.length > 0) {
      setErrorMessage(
        `${resolvedLabels.validationPrefix} ${missingQuestions.map((question) => question.label).join(', ')}`,
      )
      return
    }

    setErrorMessage(null)
    setIsSubmitting(true)

    const { normalizedAnswers, submissionDetails, content } = prepareQuestionnaireSubmission(
      questionnaire,
      answers,
      otherDrafts,
    )

    try {
      await onSubmit?.({
        questionnaireId: questionnaire.questionnaireId,
        ...(questionnaire.blockKey ? { blockKey: questionnaire.blockKey } : {}),
        answers: normalizedAnswers,
        details: submissionDetails,
        content,
      })
      setIsSubmitted(true)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : resolvedLabels.submitFailed)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderQuestion = (question: PlanQuestion) => {
    switch (question.kind) {
      case 'multi_select': {
        const multiSelectDraft = getMultiSelectDraftState(
          question,
          answers[question.id],
          otherDrafts[question.id] ?? '',
        )

        return (
          <QuestionBody>
            <OptionList>
              {question.options.map((option, index) => {
                const isSelected = multiSelectDraft.selectedValues.includes(option.value)

                return (
                  <OptionChoice
                    key={option.value}
                    questionId={question.id}
                    optionLabel={option.label}
                    index={index}
                    isSelected={isSelected}
                    isInteractionLocked={isInteractionLocked}
                    onClick={() =>
                      setAnswers((current) =>
                        toggleMultiSelectAnswer(current, question.id, option.value),
                      )
                    }
                  />
                )
              })}
              {question.allowOther ? (
                <OptionChoice
                  key={`${question.id}-other`}
                  questionId={question.id}
                  optionLabel={resolvedLabels.otherOptionLabel}
                  index={question.options.length}
                  isSelected={multiSelectDraft.hasOtherSelected}
                  isInteractionLocked={isInteractionLocked}
                  tone="other"
                  onClick={() => {
                    if (!multiSelectDraft.hasOtherSelected) {
                      setPendingFocusQuestionId(question.id)
                    }

                    setAnswers((current) => toggleMultiSelectOtherAnswer(current, question))
                  }}
                  inlineInput={
                    multiSelectDraft.hasOtherSelected ? (
                      <InlineOtherInput
                        ref={(node) => {
                          otherInputRefs.current[question.id] = node
                        }}
                        data-testid={`question-input-${question.id}`}
                        type="text"
                        value={multiSelectDraft.otherValue}
                        placeholder={resolvedLabels.otherPlaceholder}
                        readOnly={isInteractionLocked}
                        onClick={stopInputClickPropagation}
                        onKeyDown={stopInputKeyPropagation}
                        onChange={(event) => {
                          setOtherDrafts((current) => ({
                            ...current,
                            [question.id]: event.target.value,
                          }))
                        }}
                      />
                    ) : null
                  }
                />
              ) : null}
            </OptionList>
          </QuestionBody>
        )
      }
      case 'single_select': {
        const singleSelectDraft = getSingleSelectDraftState(
          question,
          answers[question.id],
          otherDrafts[question.id] ?? '',
        )

        return (
          <QuestionBody>
            <OptionList>
              {question.options.map((option, index) => {
                const isSelected = singleSelectDraft.selectedValue === option.value

                return (
                  <OptionChoice
                    key={option.value}
                    questionId={question.id}
                    optionLabel={option.label}
                    index={index}
                    isSelected={isSelected}
                    isInteractionLocked={isInteractionLocked}
                    onClick={() =>
                      setAnswers((current) => updateAnswerValue(current, question.id, option.value))
                    }
                  />
                )
              })}
              {question.allowOther ? (
                <OptionChoice
                  key={`${question.id}-other`}
                  questionId={question.id}
                  optionLabel={resolvedLabels.otherOptionLabel}
                  index={question.options.length}
                  isSelected={singleSelectDraft.selectedValue === OTHER_OPTION_VALUE}
                  isInteractionLocked={isInteractionLocked}
                  tone="other"
                  onClick={() => {
                    if (singleSelectDraft.selectedValue !== OTHER_OPTION_VALUE) {
                      setPendingFocusQuestionId(question.id)
                    }

                    setAnswers((current) =>
                      updateAnswerValue(current, question.id, OTHER_OPTION_VALUE),
                    )
                  }}
                  inlineInput={
                    singleSelectDraft.selectedValue === OTHER_OPTION_VALUE ? (
                      <InlineOtherInput
                        ref={(node) => {
                          otherInputRefs.current[question.id] = node
                        }}
                        data-testid={`question-input-${question.id}`}
                        type="text"
                        value={singleSelectDraft.otherValue}
                        placeholder={resolvedLabels.otherPlaceholder}
                        readOnly={isInteractionLocked}
                        onClick={stopInputClickPropagation}
                        onKeyDown={stopInputKeyPropagation}
                        onChange={(event) => {
                          setOtherDrafts((current) => ({
                            ...current,
                            [question.id]: event.target.value,
                          }))
                        }}
                      />
                    ) : null
                  }
                />
              ) : null}
            </OptionList>
          </QuestionBody>
        )
      }
      case 'text':
        return (
          <QuestionBody>
            <TextInput
              data-testid={`question-input-${question.id}`}
              type="text"
              value={getTextInputValue(answers[question.id])}
              placeholder={question.placeholder}
              readOnly={isInteractionLocked}
              onChange={(event) => {
                setAnswers((current) => updateAnswerValue(current, question.id, event.target.value))
              }}
            />
          </QuestionBody>
        )
      case 'number':
        return (
          <QuestionBody>
            <NumberInputRow>
              <TextInput
                data-testid={`question-input-${question.id}`}
                type="number"
                value={getNumberInputValue(answers[question.id])}
                placeholder={question.placeholder}
                readOnly={isInteractionLocked}
                onChange={(event) => {
                  setAnswers((current) =>
                    updateAnswerValue(
                      current,
                      question.id,
                      event.target.value === '' ? undefined : Number(event.target.value),
                    ),
                  )
                }}
              />
              {question.unit ? <Unit>{question.unit}</Unit> : null}
            </NumberInputRow>
          </QuestionBody>
        )
      case 'boolean':
        return (
          <QuestionBody>
            <OptionList>
              <OptionChoice
                questionId={question.id}
                optionLabel={question.trueLabel ?? 'Yes'}
                index={0}
                isSelected={answers[question.id] === true}
                isInteractionLocked={isInteractionLocked}
                onClick={() =>
                  setAnswers((current) => updateAnswerValue(current, question.id, true))
                }
              />
              <OptionChoice
                questionId={question.id}
                optionLabel={question.falseLabel ?? 'No'}
                index={1}
                isSelected={answers[question.id] === false}
                isInteractionLocked={isInteractionLocked}
                onClick={() =>
                  setAnswers((current) => updateAnswerValue(current, question.id, false))
                }
              />
            </OptionList>
          </QuestionBody>
        )
      default:
        return null
    }
  }

  return (
    <Card data-testid="questionnaire-card">
      {questionnaire.title ? <Title>{questionnaire.title}</Title> : null}
      {questionnaire.description ? <Description>{questionnaire.description}</Description> : null}
      <QuestionList>
        {questionnaire.questions.map((question) => (
          <QuestionCard key={question.id}>
            <QuestionLabel>
              {question.label}
              {question.required ? <Required>*</Required> : null}
            </QuestionLabel>
            {question.kind === 'multi_select' ? (
              <QuestionHint>{resolvedLabels.multiSelectHint}</QuestionHint>
            ) : null}
            {renderQuestion(question)}
          </QuestionCard>
        ))}
      </QuestionList>
      {visibleErrorMessage ? (
        <ErrorMessage data-testid="questionnaire-error">{visibleErrorMessage}</ErrorMessage>
      ) : null}
      {isSubmitted ? (
        <SuccessMessage data-testid="questionnaire-success">
          {resolvedLabels.submitted}
        </SuccessMessage>
      ) : interactive && !hasExternalFailureStatus ? (
        <SubmitButton
          type="button"
          data-testid="questionnaire-submit"
          disabled={isInteractionLocked}
          onClick={() => {
            void handleSubmit()
          }}
        >
          {isSubmitting ? resolvedLabels.submitting : (questionnaire.submitLabel ?? 'Submit')}
        </SubmitButton>
      ) : null}
    </Card>
  )
}

export const QuestionnaireCard = (props: QuestionnaireCardProps) => (
  <QuestionnaireCardInner key={getQuestionnaireStateKey(props.questionnaire)} {...props} />
)

const Card = styled.section`
  display: grid;
  gap: 14px;
  padding: 16px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
`

const Title = styled.strong`
  color: rgba(255, 255, 255, 0.94);
  font-size: 16px;
  line-height: 1.4;
`

const Description = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 13px;
`

const QuestionList = styled.div`
  display: grid;
  gap: 12px;
`

const QuestionCard = styled.div`
  display: grid;
  gap: 10px;
  padding: 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
`

const QuestionLabel = styled.div`
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  font-weight: 600;
`

const Required = styled.span`
  margin-left: 4px;
  color: rgba(255, 122, 122, 0.9);
`

const QuestionHint = styled.div`
  color: rgba(132, 180, 255, 0.9);
  font-size: 12px;
  line-height: 1.4;
`

const QuestionBody = styled.div`
  display: grid;
  gap: 10px;
`

const OptionList = styled.div`
  display: grid;
  gap: 10px;
`

const OptionChoiceItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  text-align: left;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  padding: 2px 12px;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  transition:
    border-color 140ms ease,
    background 140ms ease,
    transform 140ms ease;
  outline: none;

  &[data-selected='true'] {
    border-color: rgba(126, 160, 255, 0.42);
    background: linear-gradient(180deg, rgba(82, 114, 255, 0.18) 0%, rgba(82, 114, 255, 0.1) 100%);
    transform: translateY(-1px);
  }

  &[data-tone='other'] {
    border-style: dashed;
  }

  &:focus-visible {
    border-color: rgba(126, 160, 255, 0.52);
    box-shadow: 0 0 0 1px rgba(126, 160, 255, 0.18);
  }

  &[tabindex='-1'] {
    cursor: default;
    opacity: 0.72;
    transform: none;
  }
`

const OptionChoiceMarker = styled.span<{ 'data-selected'?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 28px;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.65);
  font-size: 12px;
  font-weight: 700;

  &[data-selected='true'] {
    border-color: rgba(126, 160, 255, 0.38);
    background: rgba(126, 160, 255, 0.2);
    color: rgba(255, 255, 255, 0.96);
  }
`

const OptionChoiceContent = styled.span`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  min-height: 40px;
  min-width: 0;
  flex: 1;
`

const OptionChoiceLabel = styled.span`
  color: inherit;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
`

const TextInput = styled.input`
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(13, 15, 21, 0.55);
  color: rgba(255, 255, 255, 0.92);
  font-size: 13px;
  padding: 10px 12px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.34);
  }
`

const InlineOtherInput = styled(InputField)`
  width: 100%;
  margin-top: 0;

  .compass-input-field-wrapper {
    min-height: 30px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    background: rgba(13, 15, 21, 0.55);
    box-shadow: none;
    padding: 2px 9px;
  }

  .compass-input-field-wrapper:hover {
    border-color: rgba(126, 160, 255, 0.28);
  }

  .compass-input-field-wrapper:focus-within {
    border-color: rgba(126, 160, 255, 0.42);
    box-shadow: 0 0 0 1px rgba(126, 160, 255, 0.14);
  }

  .compass-input-field-input {
    color: rgba(255, 255, 255, 0.92);
    font-size: 13px;
    line-height: 1.2;
  }

  .compass-input-field-input::placeholder {
    color: rgba(255, 255, 255, 0.34);
  }
`

const NumberInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const Unit = styled.span`
  color: rgba(255, 255, 255, 0.58);
  font-size: 12px;
  white-space: nowrap;
`

const ErrorMessage = styled.div`
  color: rgba(255, 145, 145, 0.96);
  font-size: 12px;
`

const SuccessMessage = styled.div`
  color: rgba(164, 255, 210, 0.96);
  font-size: 12px;
`

const SubmitButton = styled.button`
  justify-self: flex-start;
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
    opacity: 0.72;
  }
`

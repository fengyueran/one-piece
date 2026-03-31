import { useState, type ReactNode } from 'react'
import styled from '@emotion/styled'
import type {
  PlanQuestion,
  PlanQuestionnaire,
  PlanQuestionnaireAnswerValue,
  PlanSingleSelectQuestion,
  PlanQuestionnaireSubmission,
} from '../../../types'

export interface QuestionnaireCardProps {
  questionnaire: PlanQuestionnaire
  interactive?: boolean
  onSubmit?: (submission: PlanQuestionnaireSubmission) => void
}

const OTHER_OPTION_VALUE = '__other__'

const createInitialAnswers = (questionnaire: PlanQuestionnaire) => ({
  ...(questionnaire.answers ?? {}),
})

type QuestionnaireAnswers = Record<string, PlanQuestionnaireAnswerValue | undefined>

const getMultiSelectAnswerValues = (answer: PlanQuestionnaireAnswerValue | undefined) =>
  Array.isArray(answer) ? answer : []

const getSingleSelectDraftState = (
  question: PlanSingleSelectQuestion,
  answer: PlanQuestionnaireAnswerValue | undefined,
) => {
  if (typeof answer !== 'string') {
    return {
      selectedValue: undefined,
      otherValue: '',
    }
  }

  const matchesOption = question.options.some((option) => option.value === answer)

  return {
    selectedValue: matchesOption ? answer : question.allowOther ? OTHER_OPTION_VALUE : undefined,
    otherValue: matchesOption ? '' : answer,
  }
}

const updateAnswerValue = (
  current: QuestionnaireAnswers,
  questionId: string,
  value: PlanQuestionnaireAnswerValue | undefined,
): QuestionnaireAnswers => ({
  ...current,
  [questionId]: value,
})

const toggleMultiSelectAnswer = (
  current: QuestionnaireAnswers,
  questionId: string,
  optionValue: string,
) => {
  const currentValues = getMultiSelectAnswerValues(current[questionId])
  const nextValues = currentValues.includes(optionValue)
    ? currentValues.filter((value) => value !== optionValue)
    : [...currentValues, optionValue]

  return updateAnswerValue(current, questionId, nextValues)
}

const getTextInputValue = (answer: PlanQuestionnaireAnswerValue | undefined) =>
  typeof answer === 'string' ? String(answer) : ''

const getNumberInputValue = (answer: PlanQuestionnaireAnswerValue | undefined) =>
  typeof answer === 'number' || typeof answer === 'string' ? String(answer) : ''

const getOptionChoiceLabel = (index: number) => {
  if (index < 26) {
    return String.fromCharCode(65 + index)
  }

  return String(index + 1)
}

const isMissingRequiredAnswer = (question: PlanQuestion, answers: QuestionnaireAnswers) => {
  const answer = answers[question.id]

  switch (question.kind) {
    case 'boolean':
      return typeof answer !== 'boolean'
    case 'multi_select':
      return !Array.isArray(answer) || answer.length === 0
    case 'number':
      return typeof answer !== 'number' || Number.isNaN(answer)
    case 'text':
    case 'single_select':
      return typeof answer !== 'string' || answer.trim() === ''
    default:
      return true
  }
}

const formatQuestionAnswer = (question: PlanQuestion, answer: PlanQuestionnaireAnswerValue) => {
  switch (question.kind) {
    case 'multi_select': {
      if (!Array.isArray(answer)) {
        return ''
      }

      return answer
        .map((value) => question.options.find((option) => option.value === value)?.label ?? value)
        .join(', ')
    }
    case 'single_select': {
      if (typeof answer !== 'string') {
        return ''
      }

      const matchedOption = question.options.find((option) => option.value === answer)
      return matchedOption?.label ?? answer
    }
    case 'text':
      return String(answer)
    case 'number':
      return `${answer}${question.unit ? ` ${question.unit}` : ''}`
    case 'boolean':
      return answer ? (question.trueLabel ?? 'Yes') : (question.falseLabel ?? 'No')
    default:
      return String(answer)
  }
}

const normalizeQuestionAnswer = (
  question: PlanQuestion,
  answer: PlanQuestionnaireAnswerValue | undefined,
): PlanQuestionnaireAnswerValue | undefined => {
  if (answer === undefined) {
    return undefined
  }

  switch (question.kind) {
    case 'multi_select':
      return Array.isArray(answer) && answer.length > 0 ? answer : undefined
    case 'single_select':
    case 'text':
      return typeof answer === 'string' && answer.trim() !== '' ? answer : undefined
    case 'number':
      return typeof answer === 'number' && !Number.isNaN(answer) ? answer : undefined
    case 'boolean':
      return typeof answer === 'boolean' ? answer : undefined
    default:
      return answer
  }
}

const QuestionnaireCardInner = ({
  questionnaire,
  interactive = false,
  onSubmit,
}: QuestionnaireCardProps) => {
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(() =>
    createInitialAnswers(questionnaire),
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = () => {
    const missingQuestions = questionnaire.questions.filter(
      (question) => question.required && isMissingRequiredAnswer(question, answers),
    )

    if (missingQuestions.length > 0) {
      setErrorMessage(
        `Please complete: ${missingQuestions.map((question) => question.label).join(', ')}`,
      )
      return
    }

    setErrorMessage(null)

    const normalizedAnswers = Object.fromEntries(
      questionnaire.questions.flatMap((question) => {
        const value = normalizeQuestionAnswer(question, answers[question.id])

        return value === undefined
          ? []
          : [[question.id, value] satisfies [string, PlanQuestionnaireAnswerValue]]
      }),
    )

    const contentLines = [
      questionnaire.title ?? 'Questionnaire responses',
      ...questionnaire.questions.flatMap((question) => {
        const value = normalizedAnswers[question.id]
        if (value === undefined) {
          return []
        }

        return [`- ${question.label}: ${formatQuestionAnswer(question, value)}`]
      }),
    ]

    onSubmit?.({
      questionnaireId: questionnaire.questionnaireId,
      answers: normalizedAnswers,
      content: contentLines.join('\n'),
    })
  }

  const renderQuestion = (question: PlanQuestion) => {
    const renderOptionChoice = ({
      questionId,
      optionLabel,
      index,
      isSelected,
      onClick,
      inlineInput,
      tone = 'default',
    }: {
      questionId: string
      optionLabel: string
      index: number
      isSelected: boolean
      onClick: () => void
      inlineInput?: ReactNode
      tone?: 'default' | 'other'
    }) => (
      <OptionChoiceItem
        key={`${questionId}-${optionLabel}`}
        role="button"
        tabIndex={interactive ? 0 : -1}
        aria-pressed={isSelected}
        data-selected={isSelected}
        data-tone={tone}
        data-testid={`question-option-${questionId}-${index}`}
        onClick={(event) => {
          if (!interactive) {
            return
          }

          if (event.target instanceof HTMLElement && event.target.closest('input')) {
            return
          }

          onClick()
        }}
        onKeyDown={(event) => {
          if (!interactive) {
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

    switch (question.kind) {
      case 'multi_select':
        return (
          <QuestionBody>
            <OptionList>
              {question.options.map((option, index) => {
                const selectedValues = getMultiSelectAnswerValues(answers[question.id])
                const isSelected = selectedValues.includes(option.value)

                return renderOptionChoice({
                  questionId: question.id,
                  optionLabel: option.label,
                  index,
                  isSelected,
                  onClick: () =>
                    setAnswers((current) =>
                      toggleMultiSelectAnswer(current, question.id, option.value),
                    ),
                })
              })}
            </OptionList>
          </QuestionBody>
        )
      case 'single_select': {
        const singleSelectDraft = getSingleSelectDraftState(question, answers[question.id])

        return (
          <QuestionBody>
            <OptionList>
              {question.options.map((option, index) => {
                const isSelected = singleSelectDraft.selectedValue === option.value

                return renderOptionChoice({
                  questionId: question.id,
                  optionLabel: option.label,
                  index,
                  isSelected,
                  onClick: () =>
                    setAnswers((current) => updateAnswerValue(current, question.id, option.value)),
                })
              })}
              {question.allowOther
                ? renderOptionChoice({
                    questionId: question.id,
                    optionLabel: 'Other',
                    index: question.options.length,
                    isSelected: singleSelectDraft.selectedValue === OTHER_OPTION_VALUE,
                    tone: 'other',
                    onClick: () =>
                      setAnswers((current) =>
                        updateAnswerValue(current, question.id, singleSelectDraft.otherValue),
                      ),
                    inlineInput:
                      singleSelectDraft.selectedValue === OTHER_OPTION_VALUE ? (
                        <InlineOtherInput
                          data-testid={`question-input-${question.id}`}
                          type="text"
                          value={singleSelectDraft.otherValue}
                          placeholder="Other"
                          readOnly={!interactive}
                          onClick={(event) => {
                            event.stopPropagation()
                          }}
                          onKeyDown={(event) => {
                            event.stopPropagation()
                          }}
                          onChange={(event) => {
                            setAnswers((current) =>
                              updateAnswerValue(current, question.id, event.target.value),
                            )
                          }}
                        />
                      ) : null,
                  })
                : null}
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
              readOnly={!interactive}
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
                readOnly={!interactive}
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
              {renderOptionChoice({
                questionId: question.id,
                optionLabel: question.trueLabel ?? 'Yes',
                index: 0,
                isSelected: answers[question.id] === true,
                onClick: () =>
                  setAnswers((current) => updateAnswerValue(current, question.id, true)),
              })}
              {renderOptionChoice({
                questionId: question.id,
                optionLabel: question.falseLabel ?? 'No',
                index: 1,
                isSelected: answers[question.id] === false,
                onClick: () =>
                  setAnswers((current) => updateAnswerValue(current, question.id, false)),
              })}
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
            {renderQuestion(question)}
          </QuestionCard>
        ))}
      </QuestionList>
      {errorMessage ? (
        <ErrorMessage data-testid="questionnaire-error">{errorMessage}</ErrorMessage>
      ) : null}
      {interactive ? (
        <SubmitButton type="button" data-testid="questionnaire-submit" onClick={handleSubmit}>
          {questionnaire.submitLabel ?? 'Submit'}
        </SubmitButton>
      ) : null}
    </Card>
  )
}

const getQuestionnaireStateKey = (questionnaire: PlanQuestionnaire) =>
  JSON.stringify([
    questionnaire.questionnaireId,
    questionnaire.answers ?? {},
    questionnaire.questions,
  ])

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
  padding: 12px 14px;
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
  display: grid;
  gap: 2px;
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

const InlineOtherInput = styled(TextInput)`
  margin-top: 0;
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
`

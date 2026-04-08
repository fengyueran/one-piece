import type {
  PlanMultiSelectQuestion,
  PlanQuestion,
  PlanQuestionSubmissionDetail,
  PlanQuestionnaire,
  PlanQuestionnaireAnswerValue,
  PlanSingleSelectQuestion,
} from '../../../types'

export const OTHER_OPTION_VALUE = '__other__'

export type QuestionnaireAnswers = Record<string, PlanQuestionnaireAnswerValue | undefined>
export type QuestionnaireOtherDrafts = Record<string, string>

interface PreparedQuestionnaireSubmission {
  normalizedAnswers: Record<string, PlanQuestionnaireAnswerValue>
  submissionDetails?: Record<string, PlanQuestionSubmissionDetail>
  content: string
}

export const getQuestionnaireQuestion = (questionnaire: PlanQuestionnaire) => questionnaire.question

const getMultiSelectAnswerValues = (answer: PlanQuestionnaireAnswerValue | undefined) =>
  Array.isArray(answer) ? answer : []

const getQuestionOptionValues = (question: PlanSingleSelectQuestion | PlanMultiSelectQuestion) =>
  new Set(question.options.map((option) => option.value))

const extractSingleSelectOtherDraft = (
  question: PlanSingleSelectQuestion,
  answer: PlanQuestionnaireAnswerValue | undefined,
) => {
  if (typeof answer !== 'string') {
    return ''
  }

  return getQuestionOptionValues(question).has(answer) ? '' : answer
}

const extractMultiSelectOtherDraft = (
  question: PlanMultiSelectQuestion,
  answer: PlanQuestionnaireAnswerValue | undefined,
) => {
  if (!Array.isArray(answer)) {
    return ''
  }

  const optionValues = getQuestionOptionValues(question)
  const customValue = answer.find(
    (value) =>
      typeof value === 'string' && value !== OTHER_OPTION_VALUE && !optionValues.has(value),
  )

  return typeof customValue === 'string' ? customValue : ''
}

export const createInitialAnswers = (questionnaire: PlanQuestionnaire): QuestionnaireAnswers => {
  const initialAnswers: QuestionnaireAnswers = {}
  const question = getQuestionnaireQuestion(questionnaire)

  if (!question) {
    return initialAnswers
  }

  const answer = questionnaire.answers?.[question.id]

  switch (question.kind) {
    case 'single_select': {
      if (typeof answer !== 'string') {
        break
      }

      if (getQuestionOptionValues(question).has(answer)) {
        initialAnswers[question.id] = answer
        break
      }

      if (question.allowOther) {
        initialAnswers[question.id] = OTHER_OPTION_VALUE
      }
      break
    }
    case 'multi_select': {
      if (!Array.isArray(answer)) {
        break
      }

      const optionValues = getQuestionOptionValues(question)
      const selectedValues: string[] = []
      let hasOtherValue = false

      for (const value of answer) {
        if (typeof value !== 'string') {
          continue
        }

        if (optionValues.has(value)) {
          selectedValues.push(value)
          continue
        }

        if (question.allowOther && !hasOtherValue) {
          selectedValues.push(OTHER_OPTION_VALUE)
          hasOtherValue = true
        }
      }

      initialAnswers[question.id] = selectedValues
      break
    }
    default:
      initialAnswers[question.id] = answer
  }

  return initialAnswers
}

export const createInitialOtherDrafts = (
  questionnaire: PlanQuestionnaire,
): QuestionnaireOtherDrafts => {
  const drafts: QuestionnaireOtherDrafts = {}
  const question = getQuestionnaireQuestion(questionnaire)

  if (!question) {
    return drafts
  }

  const answer = questionnaire.answers?.[question.id]

  switch (question.kind) {
    case 'single_select':
      if (question.allowOther) {
        drafts[question.id] = extractSingleSelectOtherDraft(question, answer)
      }
      break
    case 'multi_select':
      if (question.allowOther) {
        drafts[question.id] = extractMultiSelectOtherDraft(question, answer)
      }
      break
    default:
      break
  }

  return drafts
}

export const getMultiSelectDraftState = (
  question: PlanMultiSelectQuestion,
  answer: PlanQuestionnaireAnswerValue | undefined,
  otherDraft: string,
) => {
  const answerValues = getMultiSelectAnswerValues(answer)

  return {
    selectedValues: answerValues,
    otherValue: otherDraft,
    hasOtherSelected: question.allowOther === true && answerValues.includes(OTHER_OPTION_VALUE),
  }
}

export const getSingleSelectDraftState = (
  question: PlanSingleSelectQuestion,
  answer: PlanQuestionnaireAnswerValue | undefined,
  otherDraft: string,
) => {
  if (typeof answer !== 'string') {
    return {
      selectedValue: undefined,
      otherValue: otherDraft,
    }
  }

  const matchesOption =
    answer !== OTHER_OPTION_VALUE && question.options.some((option) => option.value === answer)

  return {
    selectedValue: matchesOption ? answer : question.allowOther ? OTHER_OPTION_VALUE : undefined,
    otherValue: otherDraft,
  }
}

export const updateAnswerValue = (
  current: QuestionnaireAnswers,
  questionId: string,
  value: PlanQuestionnaireAnswerValue | undefined,
): QuestionnaireAnswers => ({
  ...current,
  [questionId]: value,
})

export const toggleMultiSelectAnswer = (
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

export const toggleMultiSelectOtherAnswer = (
  current: QuestionnaireAnswers,
  question: PlanMultiSelectQuestion,
) => {
  const currentValues = getMultiSelectAnswerValues(current[question.id])

  if (currentValues.includes(OTHER_OPTION_VALUE)) {
    return updateAnswerValue(
      current,
      question.id,
      currentValues.filter((value) => value !== OTHER_OPTION_VALUE),
    )
  }

  return updateAnswerValue(current, question.id, [...currentValues, OTHER_OPTION_VALUE])
}

export const getTextInputValue = (answer: PlanQuestionnaireAnswerValue | undefined) =>
  typeof answer === 'string' ? String(answer) : ''

export const getNumberInputValue = (answer: PlanQuestionnaireAnswerValue | undefined) =>
  typeof answer === 'number' || typeof answer === 'string' ? String(answer) : ''

export const getOptionChoiceLabel = (index: number) => {
  if (index < 26) {
    return String.fromCharCode(65 + index)
  }

  return String(index + 1)
}

const normalizeQuestionAnswer = (
  question: PlanQuestion,
  answer: PlanQuestionnaireAnswerValue | undefined,
  otherDraft = '',
): PlanQuestionnaireAnswerValue | undefined => {
  if (answer === undefined) {
    return undefined
  }

  switch (question.kind) {
    case 'multi_select':
      if (!Array.isArray(answer)) {
        return undefined
      }

      return (() => {
        const optionValues = getQuestionOptionValues(question)
        const normalizedOtherDraft = otherDraft.trim()
        const normalizedValues = answer.flatMap((value) => {
          if (typeof value !== 'string') {
            return []
          }

          if (optionValues.has(value)) {
            return [value]
          }

          if (!question.allowOther || value !== OTHER_OPTION_VALUE) {
            return []
          }

          return normalizedOtherDraft === '' ? [] : [normalizedOtherDraft]
        })

        return normalizedValues.length > 0 ? normalizedValues : undefined
      })()
    case 'single_select':
      if (answer === OTHER_OPTION_VALUE) {
        const normalizedOtherDraft = otherDraft.trim()
        return normalizedOtherDraft === '' ? undefined : normalizedOtherDraft
      }

      if (typeof answer !== 'string' || answer.trim() === '') {
        return undefined
      }

      return getQuestionOptionValues(question).has(answer) ? answer : undefined
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

const buildQuestionSubmissionDetail = (
  question: PlanQuestion,
  answer: PlanQuestionnaireAnswerValue | undefined,
): PlanQuestionSubmissionDetail | undefined => {
  if (answer === undefined) {
    return undefined
  }

  switch (question.kind) {
    case 'single_select': {
      if (typeof answer !== 'string') {
        return undefined
      }

      const optionValues = getQuestionOptionValues(question)
      const trimmedAnswer = answer.trim()

      return {
        questionId: question.id,
        kind: question.kind,
        value: answer,
        selectedOptionValues: optionValues.has(answer) ? [answer] : [],
        otherValue: optionValues.has(answer) || trimmedAnswer === '' ? undefined : trimmedAnswer,
      }
    }
    case 'multi_select': {
      if (!Array.isArray(answer)) {
        return undefined
      }

      const optionValues = getQuestionOptionValues(question)
      const selectedOptionValues = answer.filter(
        (value): value is string => typeof value === 'string' && optionValues.has(value),
      )
      const otherValue = answer.find(
        (value): value is string => typeof value === 'string' && !optionValues.has(value),
      )

      return {
        questionId: question.id,
        kind: question.kind,
        value: answer,
        selectedOptionValues,
        otherValue: otherValue?.trim() ? otherValue.trim() : undefined,
      }
    }
    default:
      return {
        questionId: question.id,
        kind: question.kind,
        value: answer,
      }
  }
}

export const getMissingRequiredQuestions = (
  questionnaire: PlanQuestionnaire,
  answers: QuestionnaireAnswers,
  otherDrafts: QuestionnaireOtherDrafts,
) => {
  const question = getQuestionnaireQuestion(questionnaire)

  if (!question || !question.required) {
    return []
  }

  return normalizeQuestionAnswer(question, answers[question.id], otherDrafts[question.id]) ===
    undefined
    ? [question]
    : []
}

export const prepareQuestionnaireSubmission = (
  questionnaire: PlanQuestionnaire,
  answers: QuestionnaireAnswers,
  otherDrafts: QuestionnaireOtherDrafts,
): PreparedQuestionnaireSubmission => {
  const question = getQuestionnaireQuestion(questionnaire)

  if (!question) {
    return {
      normalizedAnswers: {},
      submissionDetails: undefined,
      content: questionnaire.title ?? 'Questionnaire responses',
    }
  }

  const value = normalizeQuestionAnswer(question, answers[question.id], otherDrafts[question.id])
  const normalizedAnswers =
    value === undefined ? {} : { [question.id]: value satisfies PlanQuestionnaireAnswerValue }
  const detail = buildQuestionSubmissionDetail(question, normalizedAnswers[question.id])
  const submissionDetails =
    detail === undefined
      ? undefined
      : { [question.id]: detail satisfies PlanQuestionSubmissionDetail }

  return {
    normalizedAnswers,
    submissionDetails,
    content: [
      questionnaire.title ?? 'Questionnaire responses',
      ...(normalizedAnswers[question.id] === undefined
        ? []
        : [
            `- ${question.label}: ${formatQuestionAnswer(question, normalizedAnswers[question.id])}`,
          ]),
    ].join('\n'),
  }
}

export const getQuestionnaireStateKey = (questionnaire: PlanQuestionnaire) =>
  JSON.stringify([
    questionnaire.questionnaireId,
    questionnaire.blockKey,
    questionnaire.question,
    questionnaire.status,
    questionnaire.statusMessage,
  ])

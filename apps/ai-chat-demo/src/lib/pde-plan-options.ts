import type { PlanQuestionnaire, PlanQuestionOption } from '@xinghunm/ai-chat'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const normalizeOption = (option: unknown, index: number): PlanQuestionOption | null => {
  if (typeof option === 'string') {
    const trimmed = option.trim()
    if (!trimmed) return null

    return {
      label: trimmed,
      value: `option-${index + 1}`,
    }
  }

  if (!isRecord(option)) {
    return null
  }

  const labelCandidate = [option.label, option.title, option.name, option.value].find(
    (value) => typeof value === 'string' && value.trim() !== '',
  )
  const valueCandidate = [option.value, option.id, option.key, option.label, option.title].find(
    (value) => typeof value === 'string' && value.trim() !== '',
  )

  if (typeof labelCandidate !== 'string' || typeof valueCandidate !== 'string') {
    return null
  }

  return {
    label: labelCandidate,
    value: valueCandidate,
  }
}

export const createPdePlanOptionsQuestionnaire = (value: unknown): PlanQuestionnaire | null => {
  if (!isRecord(value)) {
    return null
  }

  const rawOptions = Array.isArray(value.options) ? value.options : null
  if (!rawOptions?.length) {
    return null
  }

  const options = rawOptions
    .map((option, index) => normalizeOption(option, index))
    .filter((option): option is PlanQuestionOption => option !== null)

  if (!options.length) {
    return null
  }

  const title =
    typeof value.title === 'string' && value.title.trim() !== ''
      ? value.title
      : typeof value.question === 'string' && value.question.trim() !== ''
        ? value.question
        : 'Choose a planning direction'

  const description =
    typeof value.description === 'string' && value.description.trim() !== ''
      ? value.description
      : typeof value.context === 'string' && value.context.trim() !== ''
        ? value.context
        : 'Select the planning path you want the assistant to use next.'

  const questionnaireId =
    typeof value.questionnaireId === 'string' && value.questionnaireId.trim() !== ''
      ? value.questionnaireId
      : typeof value.id === 'string' && value.id.trim() !== ''
        ? value.id
        : `plan-options-${options.map((option) => option.value).join('-')}`

  const questionId =
    typeof value.questionId === 'string' && value.questionId.trim() !== ''
      ? value.questionId
      : 'plan-direction'

  const questionLabel =
    typeof value.question === 'string' && value.question.trim() !== ''
      ? value.question
      : 'Which path should the plan follow?'

  const submitLabel =
    typeof value.submitLabel === 'string' && value.submitLabel.trim() !== ''
      ? value.submitLabel
      : 'Continue'

  return {
    questionnaireId,
    title,
    description,
    submitLabel,
    questions: [
      {
        id: questionId,
        label: questionLabel,
        kind: 'single_select',
        required: true,
        options,
      },
    ],
  }
}

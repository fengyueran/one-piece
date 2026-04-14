import React from 'react'

import Input from '../input'
import { InputFieldProps } from './types'

/**
 * Legacy text input facade kept for backward compatibility.
 *
 * Prefer importing `Input` from the package root in new code.
 */
const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>((props, ref) => (
  <Input ref={ref} {...props} />
))

InputField.displayName = 'InputField'

export default InputField

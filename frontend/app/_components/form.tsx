import { TextInputType } from '@/app/_types/inputs'
import { FormEvent, useEffect, useState } from 'react'

type FormProps = {
  buttonLabel: string
  inputsErrors: ApiResponseType | null
  inputsFields: TextInputType[]
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  successMessage?: string
}

export default function Form(props: FormProps) {
  const { inputsFields, onSubmit, inputsErrors, buttonLabel, successMessage } =
    props
  const [inputsState, setInputsState] = useState(inputsFields)
  const [globalFormErrors, setGlobalFormErrors] = useState<string[] | null>(null)

  useEffect(() => {
    // Reset errors
    setInputsState((prev) => {
      return prev.map((inputField) => ({
        ...inputField,
        errors: [],
      }))
    })
    // Field errors
    if (inputsErrors?.status === 400) {
      // Add error(s) to the corresponding field(s)
      setInputsState((prev) => {
        return prev.map((inputField) => ({
          ...inputField,
          errors: inputsErrors.data[inputField.id],
        }))
      })
    }
    // Global errors
    if (inputsErrors?.status === 401) {
      setGlobalFormErrors(inputsErrors.data.detail)
    }
  }, [inputsErrors])

  return (
    <form onSubmit={onSubmit}>
      {inputsState.map((inputField) => (
        <label key={inputField.id}>
          {inputField.label || inputField.placeholder}
          <br />
          <input
            name={inputField.id}
            placeholder={inputField.placeholder}
            required={inputField.required || true}
            defaultValue={inputField.defaultValue}
            type={inputField.type || 'text'}
          />
          {/* Field errors */}
          {inputField.errors &&
            Object.values(inputField.errors).map((error) => (
              <span style={{ color: 'red' }} key={error}>
                <br />
                {error}
              </span>
            ))}
          <br />
        </label>
      ))}
      {/* Global errors */}
      {globalFormErrors &&
        globalFormErrors.map((error, index) => (
          <span key={index} style={{ color: 'red' }}>
            {error}
          </span>
        ))}
      {/* Success message */}
      {successMessage && <span style={{ color: 'green' }}>{successMessage}</span>}
      <br />
      <button type='submit'>{buttonLabel}</button>
    </form>
  )
}

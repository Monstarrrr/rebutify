'use client'
import { FormProps, TextInput } from '@/types'
import { ChangeEvent, useEffect, useState } from 'react'

export default function Form(props: FormProps) {
  const {
    submitButtonLabel,
    id,
    inputsErrors,
    inputsFields,
    loading,
    onSubmit,
    successMessage,
  } = props
  // Renaming to avoid confusion with fields ids
  const formId = id
  const [inputsState, setInputsState] = useState(inputsFields)
  const [globalFormErrors, setGlobalFormErrors] = useState<string[] | null>(null)

  // Load cached inputs if they exist
  useEffect(() => {
    const cachedInputs = JSON.parse(localStorage.getItem(formId) || '{}')
    if (Object.keys(cachedInputs).length > 0) {
      setInputsState((prevInputs) =>
        prevInputs.map(
          (input): TextInput => ({
            ...input,
            value: Object.keys(cachedInputs).includes(input.id)
              ? cachedInputs[input.id]
              : input.value,
          }),
        ),
      )
    }
  }, [formId])

  // Currently, only reason we update the state is to cache the fields values
  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setInputsState((prev) =>
      prev.map((inputField) => {
        if (inputField.id === e.target.name) {
          return {
            ...inputField,
            value: e.target.value,
          }
        }
        return inputField
      }),
    )
    // Cache the input value in localStorage
    // For security reasons, we don't store password values
    if (e.target.type !== 'password') {
      const data = JSON.parse(localStorage.getItem(formId) || '{}')
      localStorage.setItem(
        formId,
        JSON.stringify({ ...data, [e.target.name]: e.target.value }),
      )
    }
  }

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
      {inputsState.map(
        ({ id, label, placeholder, type, value, errors, required = true }) => (
          <label key={id}>
            <strong>{label || placeholder}</strong>
            <span style={{ color: 'red' }}>{required ? '*' : ''}</span>
            <br />
            {type === 'textarea' ? (
              <textarea
                disabled={loading}
                name={id}
                placeholder={placeholder}
                required={required || true}
                onChange={handleChange}
                value={value}
                style={{
                  height: '100px',
                  width: '500px',
                }}
              />
            ) : (
              <input
                disabled={loading}
                name={id}
                placeholder={placeholder}
                required={required || true}
                onChange={handleChange}
                value={value}
                type={type || 'text'}
              />
            )}
            {/* Field errors */}
            {errors &&
              Object.values(errors).map((error) => (
                <span style={{ color: 'red' }} key={error}>
                  <br />
                  {error}
                </span>
              ))}
            <br />
          </label>
        ),
      )}
      {/* Global errors */}
      {globalFormErrors &&
        (typeof globalFormErrors === 'string' ? (
          <span style={{ color: 'red' }}>{globalFormErrors}</span>
        ) : (
          globalFormErrors.map((error) => (
            <span style={{ color: 'red' }} key={error}>
              {error}
            </span>
          ))
        ))}
      {/* Success message */}
      {successMessage && <span style={{ color: 'green' }}>{successMessage}</span>}
      <button disabled={loading} type='submit'>
        {loading ? 'Loading...' : submitButtonLabel}
      </button>
    </form>
  )
}

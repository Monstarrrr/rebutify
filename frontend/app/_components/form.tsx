'use client'
import { FormProps, TextInput } from '@/types'
import { ChangeEvent, useEffect, useState } from 'react'
import styled from 'styled-components'

const StyledForm = styled.form`
  width: 100%;
`

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;
`
const Label = styled.label`
  margin-bottom: 4px;
`

const InputStyles = `
  background-color: #1f1f1f;
  border: 1px solid white;
  border-radius: 8px;
  color: #fff;
  padding: 12px 20px;
  max-width: 640px;
`

const Input = styled.input`
  ${InputStyles}
`

const Textarea = styled.textarea`
  ${InputStyles}
`

export default function Form(props: FormProps) {
  const {
    id,
    inputsErrors,
    inputsFields,
    loading,
    onSubmit,
    children,
    success,
    setSuccess,
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
    // Reset success
    setSuccess(null)

    // Reset errors
    setInputsState((prev) => {
      return prev.map((inputField) => ({
        ...inputField,
        errors: [],
      }))
    })

    // Update state
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
    // Field errors
    if (inputsErrors?.data?.code === 422) {
      // Add error(s) to the corresponding field(s)
      setInputsState((prev) => {
        return prev.map((inputField) => ({
          ...inputField,
          errors: inputsErrors.data.formErrors[inputField.id],
        }))
      })
    }
    // Global errors
    if (inputsErrors?.status === 401) {
      setGlobalFormErrors(inputsErrors?.data?.detail || 'Unauthorized')
    }
  }, [inputsErrors])

  // Clear inputs when success
  useEffect(() => {
    if (success) {
      localStorage.removeItem(formId)
      setInputsState((prev) => {
        return prev.map((inputField) => ({
          ...inputField,
          value: '',
        }))
      })
    }
  }, [success, formId])

  return (
    <StyledForm onSubmit={onSubmit}>
      {inputsState.map(
        ({ id, label, placeholder, type, value, errors, required = true }) => (
          <InputContainer key={id}>
            {label && (
              <Label htmlFor={id}>
                <strong>{label || placeholder}</strong>
                <span style={{ color: 'red' }}>{required ? '*' : ''}</span>
              </Label>
            )}
            {type === 'textarea' ? (
              <Textarea
                disabled={loading}
                name={id}
                placeholder={placeholder}
                required={required || true}
                onChange={handleChange}
                value={value}
              />
            ) : (
              <Input
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
                  {error}
                </span>
              ))}
          </InputContainer>
        ),
      )}
      {/* Global errors */}
      {globalFormErrors &&
        (typeof globalFormErrors === 'string' ? (
          <>
            <span style={{ color: 'red' }}>{globalFormErrors}</span>
            <br />
          </>
        ) : (
          globalFormErrors.map((error) => (
            <>
              <span style={{ color: 'red' }} key={error}>
                {error}
              </span>
              <br />
            </>
          ))
        ))}

      {children}
    </StyledForm>
  )
}

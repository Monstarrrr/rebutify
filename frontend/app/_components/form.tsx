'use client'
import { SectionStyle } from '@/styles'
import { FormProps, TextInput } from '@/types'
import { ChangeEvent, useEffect, useState } from 'react'
import styled from 'styled-components'

const StyledForm = styled.form`
  width: 100%;
`

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  &:last-child {
    margin-bottom: 0;
  }
`
const Label = styled.label`
  margin-bottom: 4px;
`

const InputStyles = `
  background-color: #1f1f1f;
  border: none;
  border-radius: 8px;
  color: #fff;
  padding: 12px 20px;
`

const Input = styled.input`
  ${InputStyles}
`

const Textarea = styled.textarea`
  ${InputStyles}
`

const ButtonWrapper = styled('div')<{ $floating?: boolean }>`
  display: flex;
  gap: 8px;
  margin: 0 12px 8px;
  ${({ $floating }) => $floating && 'margin: 16px 16px 0 0;'}
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
    floating = false,
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
    return () => {
      localStorage.removeItem(formId)
      setGlobalFormErrors(null)
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

    // Update value
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
    if (
      inputsErrors?.data?.code === 422 || // schema v2
      inputsErrors?.data?.code === 400 || // schema v2
      inputsErrors?.status === 422 || // schema v1
      inputsErrors?.status === 400 // schema v1
    ) {
      // Add error(s) to the corresponding field(s)
      // schema v2:
      inputsErrors.data.formErrors &&
        setInputsState((prev) => {
          return prev.map((inputField) => ({
            ...inputField,
            errors: inputsErrors.data.formErrors[inputField.id],
          }))
        })
      // schema v1:
      setInputsState((prev) => {
        return prev.map((inputField) => ({
          ...inputField,
          errors: inputsErrors.data[inputField.id],
        }))
      })

      // Check if some fields from inputsErrors don't exist in inputsState
      const missingFields: string[] = Object.keys(inputsErrors.data).filter(
        (fieldErrorId) =>
          !inputsState.some((inputField) => inputField.id === fieldErrorId),
      )
      if (missingFields.length > 0) {
        console.error(
          `❌ Fields returned by API don't exist in inputsFields: ${missingFields.join(', ')}`,
        )
        setInputsState((prev) => {
          return prev.map((inputField) => ({
            ...inputField,
            errors: ['Some field is not being recognized, check logs.'],
          }))
        })
      }
    }
    // Global errors
    if (inputsErrors?.status === 401) {
      setGlobalFormErrors(
        inputsErrors?.data?.detail || 'Please login to perform this action.',
      )
    }
    // Internal errors
    if (inputsErrors?.status === 404 || inputsErrors?.status === 500) {
      setGlobalFormErrors(
        inputsErrors?.data?.detail ||
          'There was an error on our side, please try again later.',
      )
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
      <SectionStyle>
        {inputsState.map(
          ({
            id,
            label,
            placeholder,
            type,
            value = '',
            errors,
            required = false,
          }) => (
            <InputContainer key={id}>
              {label && (
                <Label htmlFor={id}>
                  <span style={{ marginRight: '4px', color: '#acacac' }}>
                    {label || placeholder}
                  </span>
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
      </SectionStyle>
      <ButtonWrapper
        onClick={() => setGlobalFormErrors(null)}
        $floating={floating}
      >
        {children}
      </ButtonWrapper>
    </StyledForm>
  )
}

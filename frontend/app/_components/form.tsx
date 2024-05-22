import { TextInputType } from '@/app/_types/inputs'
import { FormEvent, useEffect, useState } from 'react'

type FormProps = {
  inputs: TextInputType[]
  errors: Record<string, string> | null
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
}

export default function Form(props: FormProps) {
  const { inputs, onSubmit, errors } = props
  const [inputsState, setInputsState] = useState(inputs)

  useEffect(() => {
    if (errors) {
      setInputsState((prev) => {
        return prev.map((input) => ({
          ...input,
          errors: errors[input.id],
        }))
      })
    }
  }, [errors])

  return (
    <form onSubmit={onSubmit}>
      {inputsState.map((input) => (
        <label key={input.id}>
          {input.label || input.placeholder}
          <br />
          <input
            name={input.id}
            placeholder={input.placeholder}
            required={input.required || true}
            defaultValue={input.defaultValue}
            type={input.type || 'text'}
          />
          {input.errors &&
            Object.values(input.errors).map((error) => (
              <span style={{ color: 'red' }} key={error}>
                <br />
                {error}
              </span>
            ))}
          <br />
        </label>
      ))}
      <button type='submit'>Submit</button>
    </form>
  )
}

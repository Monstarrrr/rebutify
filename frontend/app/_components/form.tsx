import { InputType } from '@/app/_types/inputs'
import { FormEvent } from 'react'

type FormProps = {
  inputs: InputType[]
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
}

export default function Form(props: FormProps) {
  const { inputs, onSubmit } = props

  return (
    <form onSubmit={onSubmit}>
      {inputs.map((input) => (
        <label key={input.id}>
          {input.label}
          <input
            name={input.id}
            placeholder={input.placeholder || ''}
            // Inputs are required by default
            required={input.required || true}
            type={input.type}
          />
        </label>
      ))}
      <button type='submit'>Submit</button>
    </form>
  )
}

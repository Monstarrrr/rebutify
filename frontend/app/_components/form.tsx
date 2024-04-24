import { InputType } from '@/app/_models/inputs'

export default function Form(props: {
  inputs: InputType[]
  onSubmit: (e: React.FormEvent) => void
}) {
  const { inputs, onSubmit } = props

  return (
    <form>
      {inputs.map((input) => (
        <label>
          {input.label}
          <input
            name={input.name}
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

import { InputType } from '@/app/_types/inputs'

export default function Form(props: {
  inputs: InputType[]
  onSubmit: (e: React.FormEvent) => void
}) {
  const { inputs, onSubmit } = props

  return (
    <form>
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

export type InputType = {
  type: 'text' | 'password' | 'email' | 'number' | 'date' | 'time'
  name: string
  label: string
  placeholder?: string // Optional
  required?: boolean // Optional
}

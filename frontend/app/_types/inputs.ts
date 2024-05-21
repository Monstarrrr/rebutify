export type InputType = {
  id: string
  type: 'text' | 'password' | 'email' | 'number' | 'date' | 'time'
  label: string
  placeholder?: string // Optional
  required?: boolean // Optional
}

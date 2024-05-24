export type TextInputType = {
  id: string
  placeholder: string
  defaultValue?: string
  errors?: string[]
  label?: string
  required?: boolean
  type?: 'text' | 'password' | 'email' | 'number' | 'date' | 'time'
}

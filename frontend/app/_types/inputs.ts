export type TextInputType = {
  id: string
  placeholder: string
  errors?: Record<string, string> | string
  label?: string
  defaultValue?: string
  type?: 'text' | 'password' | 'email' | 'number' | 'date' | 'time'
  required?: boolean
}

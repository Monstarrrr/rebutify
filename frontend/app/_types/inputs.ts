export type TextInputType = {
  id: string
  placeholder: string
  value: string | number
  errors?: string[]
  label?: string
  required?: boolean
  type?: 'text' | 'password' | 'email' | 'number' | 'date' | 'time'
}

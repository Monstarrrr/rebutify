export type TextInput = {
  disabled?: boolean
  errors?: string[]
  id: string
  inputClassName?: string
  label?: string
  placeholder: string
  required?: boolean
  styles?: React.CSSProperties
  type?: 'text' | 'textarea' | 'password' | 'email'
  value?: string
}

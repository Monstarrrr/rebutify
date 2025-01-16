export type TextInput = {
  id: string
  placeholder: string
  value?: string
  errors?: string[]
  label?: string
  required?: boolean
  type?: 'text' | 'textarea' | 'password' | 'email'
  styles?: React.CSSProperties
  inputClassName?: string
}

export type ButtonProps = {
  label?: string

  icon?: React.ReactNode | null
  styles?: React.CSSProperties
  className?: string
  size?: 'min' | 'max'

  disabled?: boolean
  outlined?: boolean
  transparent?: boolean
  /* 
    Within forms, 'onClick' is 'onSubmit', but
    'onSubmit' is infered by <button> existing within a <form> 
    ence why we don't need to pass it 
  */
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement>,
    ...args: any[]
  ) => void | Promise<void>

  loading?: boolean
  success?: string | null
}

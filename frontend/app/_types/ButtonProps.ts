export type ButtonProps = {
  /* 
    Within forms, onClick is onSubmit but
    onSubmit is infered by <button> existing within a <form> 
    ence why we don't need to pass it 
  */
  label?: string

  icon?: React.ReactNode | null
  styles?: React.CSSProperties
  size?: 'min' | 'max'
  transparent?: boolean
  onClick?: () => void

  loading?: boolean
  success?: string | null
}

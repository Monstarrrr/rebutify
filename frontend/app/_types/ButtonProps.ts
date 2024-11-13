export type ButtonProps = {
  /* 
    Within forms, onClick is onSubmit but
    onSubmit is infered by <button> existing within a <form> 
    ence why we don't need to pass it 
  */
  onClick?: () => void
  style?: React.CSSProperties
  loading?: boolean
  label: string
  size?: 'min' | 'max'
  success?: boolean
  successMessage?: string
}

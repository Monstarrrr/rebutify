import { ReactNode } from 'react'

export type ButtonProps = React.PropsWithChildren<{
  color?: string
  label: string | ''

  icon?: ReactNode
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
}>

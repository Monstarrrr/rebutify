'use client'

import { ButtonProps } from '@/types'
import styled from 'styled-components'

const StyledButton = styled('button')<{
  $size: 'min' | 'max' | undefined
  $success: string | null
  $icon: boolean
  $transparent: boolean
  disabled: boolean | string | null
}>`
  background-color: ${(props) =>
    props.$success ? '#4CAF50' : props.$transparent ? 'transparent' : '#2196F3'};
  border: ${(props) => (props.$transparent ? '1px solid #2196F3' : 'none')};
  color: #fff;
  font-size: 1rem;
  padding: ${(props) => (props.$icon ? '4px 8px' : '6px 20px;')};
  border-radius: 99px;
  cursor: ${(props) =>
    props.disabled || props.$success ? 'not-allowed' : 'pointer'};

  ${(props) =>
    props.$size === 'max' ? `min-width: 100%;` : `width: fit-content;`}
`

export default function Button(props: ButtonProps) {
  const {
    label,
    size,
    loading = false,
    success = null,
    onClick,
    styles,
    className,
    icon = null,
    transparent = false,
  } = props
  return (
    <StyledButton
      style={styles}
      $size={size}
      onClick={onClick}
      disabled={loading || success}
      $success={success}
      $icon={!!icon}
      $transparent={transparent}
      className={className}
    >
      <span>
        {icon ?? (loading ? 'Loading...' : success ? `${success} ✅` : label)}
      </span>
    </StyledButton>
  )
}

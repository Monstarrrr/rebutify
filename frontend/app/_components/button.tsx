'use client'

import { ButtonProps } from '@/types/ButtonProps'
import styled from 'styled-components'

const StyledButton = styled('button')<{
  $size: 'min' | 'max' | undefined
  $success: boolean | undefined
  disabled: boolean | undefined
}>`
  background-color: ${(props) => (props.$success ? '#4CAF50' : '#2196F3')};
  border: none;
  color: #fff;
  font-size: 1rem;
  padding: 6px 20px;
  border-radius: 99px;
  cursor: ${(props) =>
    props.disabled || props.$success ? 'not-allowed' : 'pointer'};

  ${(props) =>
    props.$size === 'max' &&
    `
    min-width: 100%;
  `}
`

export default function Button(props: ButtonProps) {
  const { label, size, loading, success, successMessage, onClick, style } = props
  return (
    <StyledButton
      style={style}
      $size={size}
      onClick={onClick}
      disabled={loading || success}
      $success={success}
    >
      <span>
        {loading ? 'Loading...' : success ? `${successMessage} ✅` : label}
      </span>
    </StyledButton>
  )
}

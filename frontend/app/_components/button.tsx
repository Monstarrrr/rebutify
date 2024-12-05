'use client'

import { ButtonProps } from '@/types'
import styled from 'styled-components'

const StyledButton = styled('button')<{
  $size: 'min' | 'max' | undefined
  $success: string | null | undefined
  $icon: boolean | undefined
  disabled: boolean | undefined | null | string
}>`
  background-color: ${(props) => (props.$success ? '#4CAF50' : '#2196F3')};
  border: none;
  color: #fff;
  font-size: 1rem;
  padding: ${(props) => (props.$icon ? '4px 8px' : '6px 20px;')};
  border-radius: 99px;
  cursor: ${(props) =>
    props.disabled || props.$success ? 'not-allowed' : 'pointer'};

  ${(props) => props.$size === 'max' && `min-width: 100%;`}
`

export default function Button(props: ButtonProps) {
  const { label, size, loading, success, onClick, styles, icon } = props
  return (
    <StyledButton
      style={styles}
      $size={size}
      onClick={onClick}
      disabled={loading || success}
      $success={success}
      $icon={!!icon}
    >
      <span>
        {icon ?? (loading ? 'Loading...' : success ? `${success} ✅` : label)}
      </span>
    </StyledButton>
  )
}

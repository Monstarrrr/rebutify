'use client'

import { ButtonProps } from '@/types/ButtonProps'
import styled from 'styled-components'

const StyledButton = styled('button')<{ $success: boolean; disabled: boolean }>`
  background-color: ${(props) => (props.$success ? '#4CAF50' : '#2196F3')};
  border: none;
  color: #fff;
  font-size: 1.1rem;
  padding: 12px 20px;
  border-radius: 99px;
  cursor: ${(props) =>
    props.disabled || props.$success ? 'not-allowed' : 'pointer'};
  width: 100%;
`

export default function Button(props: ButtonProps) {
  const { label, loading, success, successMessage } = props
  return (
    <StyledButton disabled={loading || success} $success={success}>
      <span>
        {loading ? 'Loading...' : success ? `${successMessage} ✅` : label}
      </span>
    </StyledButton>
  )
}

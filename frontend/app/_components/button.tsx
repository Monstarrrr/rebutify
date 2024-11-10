'use client'

import styled from 'styled-components'

const StyledButton = styled.button`
  background-color: #3d6aff;
  border: none;
  color: #fff;
  font-size: 1.1rem;
  padding: 12px 20px;
  border-radius: 99px;
  cursor: pointer;
  width: 100%;
`

type ButtonProps = {
  loading: boolean
  label: string
}

export default function Button(props: ButtonProps) {
  const { label, loading } = props

  return (
    <StyledButton disabled={loading}>
      <span>{loading ? 'Loading...' : label}</span>
    </StyledButton>
  )
}

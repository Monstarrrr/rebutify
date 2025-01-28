'use client'

import { tokens } from '@/styles/tokens'
import { ButtonProps } from '@/types'
import styled from 'styled-components'

const StyledButton = styled('button')<{
  $color: string
  $size: 'min' | 'max' | undefined
  $success: string | null
  $outlined: boolean
  $transparent: boolean
  $disabled: boolean | string | null
}>`
  background-color: ${(props) => props.$color};
  border: none;
  color: ${tokens.color.primaryWeaker};
  cursor: pointer;
  font-size: 1rem;
  padding: 6px 20px;
  border-radius: 99px;
  width: fit-content;

  ${(props) =>
    props.$outlined &&
    `
    background-color: transparent;
    border: 1px solid ${props.$color};
    color: ${props.$color};
  `}
  ${(props) =>
    props.$transparent &&
    `
    background-color: transparent;
    color: ${props.$color};
    padding: 0 6px;
  `}
  ${(props) =>
    props.$success &&
    `
    background-color: ${tokens.color.accent};
    color: ${tokens.color.primaryWeaker};
  `}
  ${(props) =>
    props.$disabled &&
    `
    cursor: not-allowed;
    opacity: 0.5;
  `}
  ${(props) =>
    props.$size === 'max' &&
    `
    width: 100%;
  `}
`

export default function Button(props: ButtonProps) {
  const {
    label,
    size,
    disabled = false,
    loading = false,
    success = null,
    onClick,
    styles,
    className,
    color = tokens.color.accent,
    children,
    outlined = false,
    transparent = false,
  } = props
  return (
    <StyledButton
      style={styles}
      $color={color}
      $size={size}
      onClick={onClick}
      $disabled={loading || success || disabled}
      $success={success}
      $outlined={outlined}
      $transparent={transparent}
      className={className}
    >
      {/* Linear logic (only one condition will be true at a time) to prevent hydration errors */}
      {children ||
        (loading && 'Loading...') ||
        (success && `${success} ✅`) ||
        label}
    </StyledButton>
  )
}

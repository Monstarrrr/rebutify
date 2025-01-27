'use client'

import { tokens } from '@/styles/tokens'
import { ButtonProps } from '@/types'
import styled from 'styled-components'

const StyledButton = styled('button')<{
  $size: 'min' | 'max' | undefined
  $success: string | null
  $icon: boolean
  $outlined: boolean
  $transparent: boolean
  $disabled: boolean | string | null
}>`
  background-color: ${tokens.color.accent};
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
    border: 1px solid ${tokens.color.accent};
    color: ${tokens.color.accent};
  `}
  ${(props) =>
    props.$transparent &&
    `
    background-color: transparent;
    color: ${tokens.color.accent};
    padding: 0 6px;
  `}
  ${(props) =>
    props.$success &&
    `
    background-color: ${tokens.color.success};
    color: ${tokens.color.primaryWeaker};
  `}
  ${(props) =>
    props.$icon &&
    `
    padding: 4px 8px;
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
    icon = null,
    outlined = false,
    transparent = false,
  } = props
  return (
    <StyledButton
      style={styles}
      $size={size}
      onClick={onClick}
      $disabled={loading || success || disabled}
      $success={success}
      $icon={!!icon}
      $outlined={outlined}
      $transparent={transparent}
      className={className}
    >
      <span>
        {/* Linear logic (only one condition will be true at a time) to prevent hydration errors */}
        {icon ||
          (loading && 'Loading...') ||
          (success && `${success} ✅`) ||
          label}
      </span>
    </StyledButton>
  )
}

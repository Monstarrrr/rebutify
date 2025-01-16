import { tokens } from '@/styles/tokens'
import { icons } from '@/components'

type IconProps = {
  name: string
  color?: string
  className?: string
  direction?: 'left' | 'right' | 'down'
  size?: { width: string; height: string }
}

export default function Icon({
  name,
  color,
  className,
  direction,
  size = { width: '24px', height: '32px' },
}: IconProps) {
  let rotation = 'rotate(0deg)'
  if (direction === 'down') {
    rotation = 'rotate(180deg)'
  }
  if (direction === 'left') {
    rotation = 'rotate(270deg)'
  }
  if (direction === 'right') {
    rotation = 'rotate(90deg)'
  }

  return (
    <svg
      className={className}
      height={size.height}
      fill={color || tokens.color.secondary}
      id='Layer_1'
      style={{ transform: rotation }}
      version='1.1'
      width={size.width}
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      viewBox={icons[name].viewBox}
      xmlSpace='preserve'
    >
      <path d={icons[name].path} fillRule='evenodd' clipRule='evenodd' />
    </svg>
  )
}

import { icons } from '@/components'
export default function Icon({
  label,
  color,
  direction,
  size = { width: '24px', height: '32px' },
}: {
  label: string
  color?: string
  direction?: 'left' | 'right' | 'down'
  size?: { width: string; height: string }
}) {
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
      style={{ transform: rotation }}
      fill={color || '#fff'}
      height={size.height}
      width={size.width}
      version='1.1'
      id='Layer_1'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      viewBox={icons[label].viewBox}
      xmlSpace='preserve'
    >
      <path d={icons[label].path} />
    </svg>
  )
}

export default function Icon({
  label,
  color,
  direction,
}: {
  label: string
  color?: string
  direction?: 'left' | 'right' | 'down'
}) {
  const icons: { [key: string]: { path: string; viewBox: string } } = {
    arrow: {
      path: `M18.2929 15.2893C18.6834 14.8988 18.6834 14.2656 18.2929 13.8751L13.4007 8.98766C12.6195 8.20726 11.3537 8.20757 10.5729 8.98835L5.68257 13.8787C5.29205 14.2692 5.29205 14.9024 5.68257 15.2929C6.0731 15.6835 6.70626 15.6835 7.09679 15.2929L11.2824 11.1073C11.673 10.7168 12.3061 10.7168 12.6966 11.1073L16.8787 15.2893C17.2692 15.6798 17.9024 15.6798 18.2929 15.2893Z`,
      viewBox: '0 0 24 24',
    },
  }

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
      height='32px'
      width='24px'
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

import Link from 'next/link'
import { Button } from '@/components'

export default function LoginBlocker({ action }: { action: string }) {
  return (
    <div>
      <Link href='/login'>
        <Button label={'Login'} outlined />
      </Link>
      <span
        style={{
          opacity: 0.7,
          fontStyle: 'italic',
          marginRight: '6px',
          pointerEvents: 'none',
        }}
      >
        {' '}
        to {action}.
      </span>
    </div>
  )
}

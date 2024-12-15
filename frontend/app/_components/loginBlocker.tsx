import Link from 'next/link'
import { Button } from '@/components'

export default function LoginBlocker({ action }: { action: string }) {
  return (
    <div
      style={{
        margin: '6px',
      }}
    >
      <span
        style={{
          opacity: 0.7,
          fontStyle: 'italic',
          marginRight: '6px',
          pointerEvents: 'none',
        }}
      >
        You must be logged in to {action}.{' '}
      </span>
      <Link href='/login'>
        <Button label={'Login'} />
      </Link>
    </div>
  )
}

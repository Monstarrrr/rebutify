// rebuttalSubmition.tsx displays a form to submit a rebuttal

'use client'
import type * as type from '@/types/Post'
import { TextInput } from '@/types'
import { createPost } from '@/api/posts'
import { Form, Button } from '@/components'
import { useState } from 'react'
import { formDataToObj } from '@/helpers'
import { H2 } from '@/styles'
import { useAppSelector } from '@/store/hooks'
import { LoginBlocker } from '@/components'
// eslint-disable-next-line no-restricted-imports
import styles from './rebuttalSubmition.module.scss'

const newRebuttalInput: TextInput[] = [
  {
    id: 'body',
    label: '',
    placeholder:
      'What makes it wrong to hurt cats but not cows, pigs, or chickens?',
    type: 'textarea',
    value: '',
  },
]

type Props = {
  argument: type.Argument
  setRebuttals: React.Dispatch<React.SetStateAction<type.Post[]>>
}

export default function RebuttalSubmition({ argument, setRebuttals }: Props) {
  const user = useAppSelector((state) => state.user)
  const [loading, setLoading] = useState(false)
  const [apiErrors, setApiErrors] = useState(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setApiErrors(null)
    const formData = formDataToObj(event)

    try {
      const res = await createPost({ ...formData }, 'rebuttal', argument.id)
      setSuccess('Rebuttal submitted successfully!')
      setLoading(false)
      setRebuttals((prev) => [res.data, ...prev])
    } catch (error: any) {
      setSuccess(null)
      setLoading(false)
      setApiErrors(
        error?.response?.data?.detail ??
          error?.response?.data ??
          error?.response ??
          error,
      )
    }
  }

  return (
    <div className={styles.container}>
      <H2>Your rebuttal</H2>
      <div className={styles.wrapper}>
        {user.id ? (
          <Form
            id='new-rebuttal'
            inputsErrors={apiErrors}
            inputsFields={newRebuttalInput}
            onSubmit={handleSubmit}
            loading={loading}
            success={success}
            setSuccess={setSuccess}
          >
            <Button
              loading={loading}
              label={'Submit'}
              className={styles.submitBtn}
              success={success}
            />
          </Form>
        ) : (
          <LoginBlocker action={'submit a rebuttal'} />
        )}
      </div>
    </div>
  )
}

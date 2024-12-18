// rebuttalSubmition.tsx displays a form to submit a rebuttal

'use client'
import type * as type from '@/types/Post'
import { TextInput } from '@/types'
import { createPost } from '@/api/posts'
import { Form, Button } from '@/components'
import { useState } from 'react'
import { formDataToObj } from '@/helpers'
import { H2, SectionStyle } from '@/styles'
import { useAppSelector } from '@/store/hooks'
import { LoginBlocker } from '@/components'

const newRebuttalInput: TextInput[] = [
  {
    id: 'body',
    label: '',
    placeholder:
      'There is nothing so special about human existence that animals should have to die for us to exist ...',
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
    <div>
      <H2>Your rebuttal</H2>
      <SectionStyle>
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
            <Button loading={loading} label={'Submit'} success={success} />
          </Form>
        ) : (
          <LoginBlocker action={'submit a rebuttal'} />
        )}
      </SectionStyle>
    </div>
  )
}

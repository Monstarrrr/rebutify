// rebuttalSubmition.tsx displays a form to submit a rebuttal

'use client'
import { Argument } from '@/types/Post'
import { TextInput } from '@/types'
import { createPost } from '@/api/posts'
import { Form, Button } from '@/components'
import { useState } from 'react'
import { formDataToObj } from '@/helpers'
import styled from 'styled-components'
import { H2, SectionStyle } from '@/styles'
import { useAppSelector } from '@/store/hooks'
import Link from 'next/link'

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
  argument: Argument
}

export default function RebuttalSubmition({ argument }: Props) {
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
      const { data } = await createPost({ ...formData }, 'rebuttal', argument.id)
      setSuccess(data.message)
      setLoading(false)
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
          <p>
            You must be logged in to submit a rebuttal.{' '}
            <Link href='/login'>
              <Button label={'Login'} />
            </Link>
          </p>
        )}
      </SectionStyle>
    </div>
  )
}

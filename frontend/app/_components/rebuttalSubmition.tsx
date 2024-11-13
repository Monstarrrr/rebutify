// rebuttalSubmition.tsx displays a form to submit a rebuttal

'use client'
import { Argument } from '@/types/Post'
import { TextInput } from '@/types'
import { createPost } from '@/api/posts'
import { Form, Button } from '@/components'
import { useState } from 'react'
import { formDataToObj } from '@/helpers'

const newRebuttalInput: TextInput[] = [
  {
    id: 'body',
    label: 'Body',
    placeholder:
      'There is nothing so special about human existence that animals should have to die for us to exist ...',
    type: 'textarea',
    value: '',
  },
]
const successMessage = 'Rebuttal submitted successfully!'

type Props = {
  argument: Argument
}

export default function RebuttalSubmition({ argument }: Props) {
  const [loading, setLoading] = useState(false)
  const [apiErrors, setApiErrors] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setApiErrors(null)
    const formData = formDataToObj(event)

    try {
      const res = await createPost({ ...formData }, 'rebuttal', argument.id)
      setSuccess(true)
      setLoading(false)
      console.log(`# Create rebuttal - response :`, res)
    } catch (error: any) {
      setSuccess(false)
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
      <h2>Your rebuttal</h2>
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
          success={success}
          successMessage={successMessage}
        />
      </Form>
    </div>
  )
}

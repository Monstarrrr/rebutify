'use client'
import { FormEvent, useState } from 'react'
import { Form, Button } from '@/components'
import { TextInput } from '@/types'
import { formDataToObj } from '@/helpers'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { SectionStyle } from '@/styles'
import api from '@/api/api'

const resetPasswordInputs: TextInput[] = [
  {
    id: 'new_password',
    placeholder: 'New Password',
    type: 'password',
    value: '',
  },
  {
    id: 're_new_password',
    placeholder: 'Confirm New Password',
    type: 'password',
    value: '',
  },
]

export default function ConfirmResetPassword() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(
    'Password successfully reset',
  )
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const uid = searchParams.get('uid')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = formDataToObj(event)

    try {
      const { status } = await api.post('/auth/users/reset_password_confirm/', {
        uid: uid,
        token: token,
        new_password: formData.new_password,
        re_new_password: formData.re_new_password,
      })

      if (status >= 200 && status < 300) {
        // Success - redirect to login
        router.push('/login?reset=success')
      }
    } catch (error: any) {
      setLoading(false)
      setError(
        error.response?.data?.detail ||
          'Password reset failed. The link may have expired. Please try requesting a new reset link.',
      )
    }
  }

  return (
    <>
      <h1 style={{ marginBottom: '12px' }}>Reset Password</h1>
      <SectionStyle>
        {error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : (
          <Form
            id='reset-password-form'
            inputsFields={resetPasswordInputs}
            onSubmit={handleSubmit}
            loading={loading}
            inputsErrors={null}
            success={success}
            setSuccess={() => setSuccess}
          >
            <Button size='max' loading={loading} label='Reset Password' />
          </Form>
        )}
      </SectionStyle>
    </>
  )
}

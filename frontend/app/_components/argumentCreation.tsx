'use client'
// eslint-disable-next-line no-restricted-imports
import styles from './argumentCreation.module.scss'
import { FormEvent, useState } from 'react'
import { Button, Form } from '@/components'
import Link from 'next/link'
import { useAppSelector } from '@/store/hooks'
import { formDataToObj } from '@/helpers'
import { createPost } from '@/api/posts'
import { useRouter } from 'next/navigation'

export default function ArgumentCreation() {
  const user = useAppSelector((state) => state.user)
  const router = useRouter()
  const [isFormActive, setIsFormActive] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [apiErrors, setApiErrors] = useState(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleToggleForm = () => {
    setIsFormActive(!isFormActive)
  }

  const handleSubmitArgument = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setApiErrors(null)
    const formData = formDataToObj(event)

    try {
      console.log(`test debug boop bip 1`)
      await createPost({ ...formData }, 'argument')
      setLoading(false)
      console.log(`test debug boop bip 2`)
      setSuccess('Post created successfully!')
      try {
        router.refresh()
        console.log(`test debug boop bip 3`)
      } catch (error) {
        console.log(`error refreshing page with router`, error)
      }
    } catch (error: any) {
      const { response } = error
      setLoading(false)
      setApiErrors(response)
    }
  }

  return (
    <div className={styles.formContainer}>
      {isFormActive ? (
        <Form
          id='new-argument'
          inputsErrors={apiErrors}
          inputsFields={[
            {
              id: 'title',
              label: 'Title',
              placeholder: 'e.g. "Plants are alive too!"',
              required: true,
              value: '',
            },
            {
              id: 'body',
              label: 'Argument',
              placeholder: `e.g. "If vegans don't eat meat, why do they eat plants? They are living beings too!"`,
              type: 'textarea',
              value: '',
              required: true,
              inputClassName: styles.argumentTextArea,
            },
          ]}
          onSubmit={handleSubmitArgument}
          loading={loading}
          success={success}
          setSuccess={setSuccess}
          floating
        >
          <Button
            label={'Submit argument'}
            loading={loading}
            success={success}
            size={'max'}
          />
        </Form>
      ) : (
        <p className={styles.hintText}>Can&apos;t find it?</p>
      )}
      {user.id ? (
        <Button
          label={isFormActive ? 'Cancel' : 'Create argument'}
          transparent={isFormActive}
          size='max'
          className={isFormActive ? styles.cancelBtn : styles.createBtn}
          onClick={handleToggleForm}
        />
      ) : (
        <Link href={'/login'}>
          <Button
            label={'Create argument'}
            size='max'
            className={styles.createBtn}
          />
        </Link>
      )}
    </div>
  )
}

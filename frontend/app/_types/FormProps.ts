import { FormEvent } from 'react'
import { ApiResponse, TextInput } from '@/types'

export type FormProps = {
  id: string
  inputsErrors: ApiResponse | null
  inputsFields: TextInput[]
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  loading?: boolean
  submitButtonLabel: string
  successMessage?: string | null
}

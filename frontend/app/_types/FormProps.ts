import { FormEvent } from 'react'
import { ApiResponse, TextInput } from '@/types'

export type FormProps = {
  buttonLabel: string
  id: string
  inputsErrors: ApiResponse | null
  inputsFields: TextInput[]
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  loading?: boolean
  successMessage?: string | null
}

import { FormEvent } from 'react'
import { ApiResponse, TextInput } from '@/types'

export type FormProps = {
  id: string
  inputsErrors: ApiResponse | null
  inputsFields: TextInput[]
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  setSuccess: (success: boolean) => void
  loading: boolean
  success: boolean
  // Children is the submit button
  children: React.ReactElement | null
}

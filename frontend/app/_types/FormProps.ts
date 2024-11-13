import { FormEvent } from 'react'
import { ApiResponse, TextInput } from '@/types'

export type FormProps = {
  id: string
  inputsErrors: ApiResponse | null
  inputsFields: TextInput[]
  onSubmit: (e: FormEvent<HTMLFormElement>) => void

  loading: boolean
  success: boolean
  setSuccess: (success: boolean) => void

  // Children is the submit button
  children: React.ReactElement | null
}

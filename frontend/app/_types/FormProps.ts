import { FormEvent } from 'react'
import { TextInput } from '@/types'
import { AxiosResponse } from 'axios'

export type FormProps = {
  id: string
  inputsErrors: AxiosResponse | null
  inputsFields: TextInput[]
  onSubmit: (e: FormEvent<HTMLFormElement>) => void

  loading: boolean
  success: string | null
  setSuccess: (success: string | null) => void

  // Children is the submit button
  children: React.ReactElement | null
}

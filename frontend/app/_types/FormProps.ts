import { FormEvent } from 'react'
import { TextInput } from '@/types'
import { AxiosResponse } from 'axios'

export type FormProps = {
  id: string // A name for the form
  inputsErrors: AxiosResponse | null
  inputsFields: TextInput[]
  onSubmit: (e: FormEvent<HTMLFormElement>) => void

  loading: boolean
  success: string | null
  setSuccess: (success: string | null) => void // To reset success message onChange

  // Children is the submit button
  children: React.ReactElement | null

  // Floating form (submit button outside)
  floating?: boolean
}

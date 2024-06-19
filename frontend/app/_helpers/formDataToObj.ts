import { FormDataObj } from '@/types'
import { FormEvent } from 'react'

// Convert FormData entries to a plain object
export default function formDataToObj(event: FormEvent<HTMLFormElement>) {
  /* 
    Use FormData to collect values (rather than e.g. finding <input> elements) 
    to ensure we get values from all form items correctly (e.g. checkboxes and textareas).
  */
  const formData = new FormData(event.currentTarget)

  // Append the input fields to a data object
  const data: FormDataObj = {}
  for (const [key, value] of formData.entries()) {
    data[key] = value
  }

  return data
}

// formDataToObj.ts creates FormData entries from a form and converts them to a plain object

import { FormDataObj } from '@/types'
import { FormEvent } from 'react'

// Either pass in the form event or the FormData directly
export default function formDataToObj(
  event?: FormEvent<HTMLFormElement>,
  data?: FormDataObj,
) {
  /* 
    We use FormData to collect values (rather than e.g. finding <input> elements) 
    to ensure we get values from all form items correctly (e.g. checkboxes and textareas).
  */
  if (!event && !data) {
    throw new Error('❌ Missing event or data in formDataToObj()')
  }
  const formData = data ?? new FormData(event?.currentTarget)

  // Append the input fields to a data object
  const obj: FormDataObj = {}
  for (const [key, value] of formData.entries()) {
    obj[key] = value
  }

  return obj
}

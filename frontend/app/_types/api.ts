type ApiResponseType = {
  config: Object
  data: {
    [key: string]: string[]
  }
  headers: Object
  request: XMLHttpRequest
  status: number
  statusText: string
}

export type ApiResponse = {
  config: Object
  data: {
    [key: string]: string[]
  }
  headers: Object
  request: XMLHttpRequest
  status: number
}

export type ApiResponse = {
  message: string
}

export type OkResponse = ApiResponse
export type RetrievedResponse = ApiResponse & {
  resources: Object
}
export type CreatedResponse = RetrievedResponse

export type BadFormResponse = ApiResponse & {
  formErrors?: {
    [key: string]: string[]
  }
}
export type BadRequestResponse = ApiResponse
export type UnauthorizedResponse = ApiResponse
export type NotFoundResponse = ApiResponse
export type InternalServerErrorResponse = ApiResponse

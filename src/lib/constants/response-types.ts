export enum ResponseStatusType {
  Success = "success",
  Error = "error",
}
export type ResponseStatusCode = 200 | 201 | 400 | 401 | 403 | 404 | 500 | 429;

export type ApiResponseFormat = {
  result: any;
  statusCode: ResponseStatusCode;
  status: ResponseStatusType;
};

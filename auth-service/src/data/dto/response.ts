export type AppResponse<T> =
  | { data: T; message?: never; errors?: never } // Success: Must have data, no message
  | { message: string; data?: never; errors?: any }; // Error: Must have message, no data, errors optional

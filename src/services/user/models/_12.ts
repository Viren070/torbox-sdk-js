import { z } from 'zod';
import { _13, _13Request, _13Response } from './_13';

export type I_12Schema = {
  data?: any | null;
  detail?: _13;
  error?: string;
  success?: boolean;
};

export const _12Response = z.lazy(() => {
  return z
    .object({
      data: z.any().optional().nullable(),
      detail: _13Response.optional(),
      error: z.string().optional(),
      success: z.boolean().optional(),
    })
    .transform((data) => ({
      data: data['data'],
      detail: data['detail'],
      error: data['error'],
      success: data['success'],
    }));
});

export class _12 extends Error {
  public data?: any | null;
  public detail?: _13;
  public error?: string;
  public success?: boolean;
  constructor(message?: string, response?: unknown) {
    super(message);

    const parsedResponse = _12Response.parse(response);

    this.data = parsedResponse.data;
    this.detail = parsedResponse.detail;
    this.error = parsedResponse.error;
    this.success = parsedResponse.success;
  }
}

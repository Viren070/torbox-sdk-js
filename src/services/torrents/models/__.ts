import { z } from 'zod';
import { _1, _1Request, _1Response } from './_1';

export type I__Schema = {
  data?: _1;
  detail?: string;
  error?: boolean;
  success?: boolean;
};

export const _response = z.lazy(() => {
  return z
    .object({
      data: _1Response.optional().nullable(),
      detail: z.string().optional(),
      error: z.boolean().optional().nullable(),
      success: z.boolean().optional(),
    })
    .transform((data) => ({
      data: data['data'],
      detail: data['detail'],
      error: data['error'],
      success: data['success'],
    }));
});

export class __ extends Error {
  public data?: _1;
  public detail?: string;
  public error?: boolean;
  public success?: boolean;
  constructor(message?: string, response?: unknown) {
    super(message);

    const parsedResponse = _response.parse(response);

    this.data = parsedResponse.data;
    this.detail = parsedResponse.detail;
    this.error = parsedResponse.error;
    this.success = parsedResponse.success;
  }
}

import { z } from 'zod';

export type I_8Schema = {
  data?: any;
  detail?: string;
  error?: string;
  success?: boolean;
};

export const _8Response = z.lazy(() => {
  return z
    .object({
      data: z.any().optional().nullable(),
      detail: z.string().optional(),
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

export class _8 extends Error {
  public data?: any;
  public detail?: string;
  public error?: string;
  public success?: boolean;
  constructor(message?: string, response?: unknown) {
    super(message);

    const parsedResponse = _8Response.parse(response);

    this.data = parsedResponse.data;
    this.detail = parsedResponse.detail;
    this.error = parsedResponse.error;
    this.success = parsedResponse.success;
  }
}

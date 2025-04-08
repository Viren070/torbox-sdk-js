import { z } from 'zod';

export type I_16Schema = {
  data?: string;
  detail?: string;
  error?: string;
  success?: boolean;
};

export const _16Response = z.lazy(() => {
  return z
    .object({
      data: z.string().optional(),
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

export class _16 extends Error {
  public data?: string;
  public detail?: string;
  public error?: string;
  public success?: boolean;
  constructor(message?: string, response?: unknown) {
    super(message);

    const parsedResponse = _16Response.parse(response);

    this.data = parsedResponse.data;
    this.detail = parsedResponse.detail;
    this.error = parsedResponse.error;
    this.success = parsedResponse.success;
  }
}

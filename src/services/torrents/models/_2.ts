import { z } from 'zod';

export type I_2Schema = {
  data?: any;
  detail?: string;
  error?: any;
  success?: boolean;
};

export const _2Response = z.lazy(() => {
  return z
    .object({
      data: z.any().optional().nullable(),
      detail: z.string().optional(),
      error: z.any().optional().nullable(),
      success: z.boolean().optional(),
    })
    .transform((data) => ({
      data: data['data'],
      detail: data['detail'],
      error: data['error'],
      success: data['success'],
    }));
});

export class _2 extends Error {
  public data?: any;
  public detail?: string;
  public error?: any;
  public success?: boolean;
  constructor(message?: string, response?: unknown) {
    super(message);

    const parsedResponse = _2Response.parse(response);

    this.data = parsedResponse.data;
    this.detail = parsedResponse.detail;
    this.error = parsedResponse.error;
    this.success = parsedResponse.success;
  }
}

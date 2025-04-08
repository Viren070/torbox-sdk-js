import { z } from 'zod';

/**
 * The shape of the model inside the application code - what the users use
 */
export const controlTorrentOkResponse = z.lazy(() => {
  return z.object({
    data: z.any().optional().nullable(),
    detail: z.string().optional(),
    error: z.any().optional().nullable(),
    success: z.boolean().optional(),
  });
});

/**
 *
 * @typedef  {ControlTorrentOkResponse} controlTorrentOkResponse
 * @property {any}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
export type ControlTorrentOkResponse = z.infer<typeof controlTorrentOkResponse>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const controlTorrentOkResponseResponse = z.lazy(() => {
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

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const controlTorrentOkResponseRequest = z.lazy(() => {
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

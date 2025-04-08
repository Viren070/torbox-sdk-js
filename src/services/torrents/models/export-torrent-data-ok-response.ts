import { z } from 'zod';

/**
 * The shape of the model inside the application code - what the users use
 */
export const exportTorrentDataOkResponse = z.lazy(() => {
  return z.object({
    data: z.string().optional(),
    detail: z.string().optional(),
    error: z.any().optional().nullable(),
    success: z.boolean().optional(),
  });
});

/**
 *
 * @typedef  {ExportTorrentDataOkResponse} exportTorrentDataOkResponse
 * @property {string}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
export type ExportTorrentDataOkResponse = z.infer<typeof exportTorrentDataOkResponse>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const exportTorrentDataOkResponseResponse = z.lazy(() => {
  return z
    .object({
      data: z.string().optional(),
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
export const exportTorrentDataOkResponseRequest = z.lazy(() => {
  return z
    .object({
      data: z.string().optional(),
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

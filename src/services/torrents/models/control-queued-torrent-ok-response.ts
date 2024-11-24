import { z } from 'zod';

/**
 * The shape of the model inside the application code - what the users use
 */
export const controlQueuedTorrentOkResponse = z.lazy(() => {
  return z.object({
    data: z.any().optional().nullable(),
    detail: z.string().optional(),
    error: z.any().optional().nullable(),
    success: z.boolean().optional(),
  });
});

/**
 *
 * @typedef  {ControlQueuedTorrentOkResponse} controlQueuedTorrentOkResponse
 * @property {any}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
export type ControlQueuedTorrentOkResponse = z.infer<typeof controlQueuedTorrentOkResponse>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const controlQueuedTorrentOkResponseResponse = z.lazy(() => {
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
export const controlQueuedTorrentOkResponseRequest = z.lazy(() => {
  return z
    .object({
      data: z.any().nullish(),
      detail: z.string().nullish(),
      error: z.any().nullish(),
      success: z.boolean().nullish(),
    })
    .transform((data) => ({
      data: data['data'],
      detail: data['detail'],
      error: data['error'],
      success: data['success'],
    }));
});

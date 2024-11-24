import { z } from 'zod';

/**
 * The shape of the model inside the application code - what the users use
 */
export const exportTorrentDataOkResponse = z.lazy(() => {
  return z.object({
    data: z.string().optional(),
    detail: z.string().optional(),
  });
});

/**
 *
 * @typedef  {ExportTorrentDataOkResponse} exportTorrentDataOkResponse
 * @property {string}
 * @property {string}
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
    })
    .transform((data) => ({
      data: data['data'],
      detail: data['detail'],
    }));
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const exportTorrentDataOkResponseRequest = z.lazy(() => {
  return z.object({ data: z.string().nullish(), detail: z.string().nullish() }).transform((data) => ({
    data: data['data'],
    detail: data['detail'],
  }));
});

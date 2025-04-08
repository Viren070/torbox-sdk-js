import { z } from 'zod';

/**
 * The shape of the model inside the application code - what the users use
 */
export const getTorrentCachedAvailabilityOkResponseData = z.lazy(() => {
  return z.object({
    name: z.string().optional(),
    size: z.number().optional(),
    hash: z.string().optional(),
  });
});

/**
 *
 * @typedef  {GetTorrentCachedAvailabilityOkResponseData} getTorrentCachedAvailabilityOkResponseData
 * @property {string}
 * @property {number}
 * @property {string}
 */
export type GetTorrentCachedAvailabilityOkResponseData = z.infer<typeof getTorrentCachedAvailabilityOkResponseData>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const getTorrentCachedAvailabilityOkResponseDataResponse = z.lazy(() => {
  return z
    .object({
      name: z.string().optional(),
      size: z.number().optional(),
      hash: z.string().optional(),
    })
    .transform((data) => ({
      name: data['name'],
      size: data['size'],
      hash: data['hash'],
    }));
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const getTorrentCachedAvailabilityOkResponseDataRequest = z.lazy(() => {
  return z
    .object({
      name: z.string().optional(),
      size: z.number().optional(),
      hash: z.string().optional(),
    })
    .transform((data) => ({
      name: data['name'],
      size: data['size'],
      hash: data['hash'],
    }));
});

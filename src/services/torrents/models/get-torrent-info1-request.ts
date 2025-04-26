import { z } from 'zod';

/**
 * The shape of the model inside the application code - what the users use
 */
export const getTorrentInfo1Request = z.lazy(() => {
  return z.object({
    hash: z.string().optional(),
  });
});

/**
 *
 * @typedef  {GetTorrentInfo1Request} getTorrentInfo1Request
 * @property {string} - Hash of the torrent you want to get info for. This is required.
 */
export type GetTorrentInfo1Request = z.infer<typeof getTorrentInfo1Request>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const getTorrentInfo1RequestResponse = z.lazy(() => {
  return z
    .object({
      hash: z.string().optional(),
    })
    .transform((data) => ({
      hash: data['hash'],
    }));
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const getTorrentInfo1RequestRequest = z.lazy(() => {
  return z
    .object({
      hash: z.string().optional(),
    })
    .transform((data) => ({
      hash: data['hash'],
    }));
});

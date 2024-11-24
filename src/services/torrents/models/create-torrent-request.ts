import { z } from 'zod';

/**
 * The shape of the model inside the application code - what the users use
 */
export const createTorrentRequest = z.lazy(() => {
  return z.object({
    file: z.instanceof(ArrayBuffer).optional(),
    magnet: z.string().optional(),
  });
});

/**
 *
 * @typedef  {CreateTorrentRequest} createTorrentRequest
 * @property {ArrayBuffer} - The torrent's torrent file. Optional.
 * @property {string} - The torrent's magnet link. Optional.
 */
export type CreateTorrentRequest = z.infer<typeof createTorrentRequest>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const createTorrentRequestResponse = z.lazy(() => {
  return z
    .object({
      file: z.instanceof(ArrayBuffer).optional(),
      magnet: z.string().optional(),
    })
    .transform((data) => ({
      file: data['file'],
      magnet: data['magnet'],
    }));
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const createTorrentRequestRequest = z.lazy(() => {
  return z.object({ file: z.instanceof(ArrayBuffer).nullish(), magnet: z.string().nullish() }).transform((data) => ({
    file: data['file'],
    magnet: data['magnet'],
  }));
});

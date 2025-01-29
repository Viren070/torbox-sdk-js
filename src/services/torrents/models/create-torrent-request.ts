import { z } from 'zod';

/**
 * The shape of the model inside the application code - what the users use
 */
export const createTorrentRequest = z.lazy(() => {
  return z.object({
    allowZip: z.string().optional(),
    asQueued: z.string().optional(),
    file: z.instanceof(ArrayBuffer).optional(),
    magnet: z.string().optional(),
    name: z.string().optional(),
    seed: z.string().optional(),
  });
});

/**
 *
 * @typedef  {CreateTorrentRequest} createTorrentRequest
 * @property {string} - Tells TorBox if you want to allow this torrent to be zipped or not. TorBox only zips if the torrent is 100 files or larger.
 * @property {string} - Tells TorBox you want this torrent instantly queued. This is bypassed if user is on free plan, and will process the request as normal in this case. Optional.
 * @property {ArrayBuffer} - The torrent's torrent file. Optional.
 * @property {string} - The torrent's magnet link. Optional.
 * @property {string} - The name you want the torrent to be. Optional.
 * @property {string} - Tells TorBox your preference for seeding this torrent. 1 is auto. 2 is seed. 3 is don't seed. Optional. Default is 1, or whatever the user has in their settings. Overwrites option in settings.
 */
export type CreateTorrentRequest = z.infer<typeof createTorrentRequest>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const createTorrentRequestResponse = z.lazy(() => {
  return z
    .object({
      allow_zip: z.string().optional(),
      as_queued: z.string().optional(),
      file: z.instanceof(ArrayBuffer).optional(),
      magnet: z.string().optional(),
      name: z.string().optional(),
      seed: z.string().optional(),
    })
    .transform((data) => ({
      allowZip: data['allow_zip'],
      asQueued: data['as_queued'],
      file: data['file'],
      magnet: data['magnet'],
      name: data['name'],
      seed: data['seed'],
    }));
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const createTorrentRequestRequest = z.lazy(() => {
  return z
    .object({
      allowZip: z.string().nullish(),
      asQueued: z.string().nullish(),
      file: z.instanceof(ArrayBuffer).nullish(),
      magnet: z.string().nullish(),
      name: z.string().nullish(),
      seed: z.string().nullish(),
    })
    .transform((data) => ({
      allow_zip: data['allowZip'],
      as_queued: data['asQueued'],
      file: data['file'],
      magnet: data['magnet'],
      name: data['name'],
      seed: data['seed'],
    }));
});

import { z } from 'zod';

/**
 * The shape of the model inside the application code - what the users use
 */
export const searchAllTorrentsFromScraperOkResponseData = z.lazy(() => {
  return z.object({
    categories: z.array(z.string()).optional(),
    hash: z.string().optional(),
    id: z.string().optional(),
    magnet: z.string().optional(),
    name: z.string().optional(),
    peers: z.number().optional(),
    preferredType: z.string().optional(),
    seeders: z.number().optional(),
    size: z.number().optional(),
    source: z.string().optional(),
    torrentFile: z.string().optional(),
    updatedAt: z.string().optional(),
    website: z.string().optional(),
  });
});

/**
 *
 * @typedef  {SearchAllTorrentsFromScraperOkResponseData} searchAllTorrentsFromScraperOkResponseData
 * @property {string[]}
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {number}
 * @property {string}
 * @property {number}
 * @property {number}
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {string}
 */
export type SearchAllTorrentsFromScraperOkResponseData = z.infer<typeof searchAllTorrentsFromScraperOkResponseData>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const searchAllTorrentsFromScraperOkResponseDataResponse = z.lazy(() => {
  return z
    .object({
      categories: z.array(z.string()).optional(),
      hash: z.string().optional(),
      id: z.string().optional(),
      magnet: z.string().optional(),
      name: z.string().optional(),
      peers: z.number().optional(),
      preferred_type: z.string().optional(),
      seeders: z.number().optional(),
      size: z.number().optional(),
      source: z.string().optional(),
      torrent_file: z.string().optional(),
      updated_at: z.string().optional(),
      website: z.string().optional(),
    })
    .transform((data) => ({
      categories: data['categories'],
      hash: data['hash'],
      id: data['id'],
      magnet: data['magnet'],
      name: data['name'],
      peers: data['peers'],
      preferredType: data['preferred_type'],
      seeders: data['seeders'],
      size: data['size'],
      source: data['source'],
      torrentFile: data['torrent_file'],
      updatedAt: data['updated_at'],
      website: data['website'],
    }));
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const searchAllTorrentsFromScraperOkResponseDataRequest = z.lazy(() => {
  return z
    .object({
      categories: z.array(z.string()).nullish(),
      hash: z.string().nullish(),
      id: z.string().nullish(),
      magnet: z.string().nullish(),
      name: z.string().nullish(),
      peers: z.number().nullish(),
      preferredType: z.string().nullish(),
      seeders: z.number().nullish(),
      size: z.number().nullish(),
      source: z.string().nullish(),
      torrentFile: z.string().nullish(),
      updatedAt: z.string().nullish(),
      website: z.string().nullish(),
    })
    .transform((data) => ({
      categories: data['categories'],
      hash: data['hash'],
      id: data['id'],
      magnet: data['magnet'],
      name: data['name'],
      peers: data['peers'],
      preferred_type: data['preferredType'],
      seeders: data['seeders'],
      size: data['size'],
      source: data['source'],
      torrent_file: data['torrentFile'],
      updated_at: data['updatedAt'],
      website: data['website'],
    }));
});

import { z } from 'zod';

/**
 * The shape of the model inside the application code - what the users use
 */
export const createTorrentOkResponseData = z.lazy(() => {
  return z.object({
    activeLimit: z.number().optional(),
    authId: z.string().optional(),
    currentActiveDownloads: z.number().optional(),
    hash: z.string().optional(),
    queuedId: z.number().optional(),
    torrentId: z.number().optional(),
  });
});

/**
 *
 * @typedef  {CreateTorrentOkResponseData} createTorrentOkResponseData
 * @property {number}
 * @property {string}
 * @property {number}
 * @property {string}
 * @property {number}
 * @property {number}
 */
export type CreateTorrentOkResponseData = z.infer<typeof createTorrentOkResponseData>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const createTorrentOkResponseDataResponse = z.lazy(() => {
  return z
    .object({
      active_limit: z.number().optional(),
      auth_id: z.string().optional(),
      current_active_downloads: z.number().optional(),
      hash: z.string().optional(),
      queued_id: z.number().optional(),
      torrent_id: z.number().optional(),
    })
    .transform((data) => ({
      activeLimit: data['active_limit'],
      authId: data['auth_id'],
      currentActiveDownloads: data['current_active_downloads'],
      hash: data['hash'],
      queuedId: data['queued_id'],
      torrentId: data['torrent_id'],
    }));
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const createTorrentOkResponseDataRequest = z.lazy(() => {
  return z
    .object({
      activeLimit: z.number().optional(),
      authId: z.string().optional(),
      currentActiveDownloads: z.number().optional(),
      hash: z.string().optional(),
      queuedId: z.number().optional(),
      torrentId: z.number().optional(),
    })
    .transform((data) => ({
      active_limit: data['activeLimit'],
      auth_id: data['authId'],
      current_active_downloads: data['currentActiveDownloads'],
      hash: data['hash'],
      queued_id: data['queuedId'],
      torrent_id: data['torrentId'],
    }));
});

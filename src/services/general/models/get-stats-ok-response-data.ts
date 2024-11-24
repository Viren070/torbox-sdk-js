import { z } from 'zod';

/**
 * The shape of the model inside the application code - what the users use
 */
export const getStatsOkResponseData = z.lazy(() => {
  return z.object({
    activeTorrents: z.number().optional(),
    activeUsenetDownloads: z.number().optional(),
    activeWebDownloads: z.number().optional(),
    totalBytesDownloaded: z.number().optional(),
    totalBytesUploaded: z.number().optional(),
    totalDownloads: z.number().optional(),
    totalServers: z.number().optional(),
    totalTorrentDownloads: z.number().optional(),
    totalUsenetDownloads: z.number().optional(),
    totalUsers: z.number().optional(),
    totalWebDownloads: z.number().optional(),
  });
});

/**
 *
 * @typedef  {GetStatsOkResponseData} getStatsOkResponseData
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {number}
 */
export type GetStatsOkResponseData = z.infer<typeof getStatsOkResponseData>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const getStatsOkResponseDataResponse = z.lazy(() => {
  return z
    .object({
      active_torrents: z.number().optional(),
      active_usenet_downloads: z.number().optional(),
      active_web_downloads: z.number().optional(),
      total_bytes_downloaded: z.number().optional(),
      total_bytes_uploaded: z.number().optional(),
      total_downloads: z.number().optional(),
      total_servers: z.number().optional(),
      total_torrent_downloads: z.number().optional(),
      total_usenet_downloads: z.number().optional(),
      total_users: z.number().optional(),
      total_web_downloads: z.number().optional(),
    })
    .transform((data) => ({
      activeTorrents: data['active_torrents'],
      activeUsenetDownloads: data['active_usenet_downloads'],
      activeWebDownloads: data['active_web_downloads'],
      totalBytesDownloaded: data['total_bytes_downloaded'],
      totalBytesUploaded: data['total_bytes_uploaded'],
      totalDownloads: data['total_downloads'],
      totalServers: data['total_servers'],
      totalTorrentDownloads: data['total_torrent_downloads'],
      totalUsenetDownloads: data['total_usenet_downloads'],
      totalUsers: data['total_users'],
      totalWebDownloads: data['total_web_downloads'],
    }));
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const getStatsOkResponseDataRequest = z.lazy(() => {
  return z
    .object({
      activeTorrents: z.number().nullish(),
      activeUsenetDownloads: z.number().nullish(),
      activeWebDownloads: z.number().nullish(),
      totalBytesDownloaded: z.number().nullish(),
      totalBytesUploaded: z.number().nullish(),
      totalDownloads: z.number().nullish(),
      totalServers: z.number().nullish(),
      totalTorrentDownloads: z.number().nullish(),
      totalUsenetDownloads: z.number().nullish(),
      totalUsers: z.number().nullish(),
      totalWebDownloads: z.number().nullish(),
    })
    .transform((data) => ({
      active_torrents: data['activeTorrents'],
      active_usenet_downloads: data['activeUsenetDownloads'],
      active_web_downloads: data['activeWebDownloads'],
      total_bytes_downloaded: data['totalBytesDownloaded'],
      total_bytes_uploaded: data['totalBytesUploaded'],
      total_downloads: data['totalDownloads'],
      total_servers: data['totalServers'],
      total_torrent_downloads: data['totalTorrentDownloads'],
      total_usenet_downloads: data['totalUsenetDownloads'],
      total_users: data['totalUsers'],
      total_web_downloads: data['totalWebDownloads'],
    }));
});

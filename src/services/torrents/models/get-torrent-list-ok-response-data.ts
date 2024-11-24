import { z } from 'zod';
import { dataFiles1, dataFiles1Request, dataFiles1Response } from './data-files-1';

/**
 * The shape of the model inside the application code - what the users use
 */
export const getTorrentListOkResponseData = z.lazy(() => {
  return z.object({
    active: z.boolean().optional(),
    authId: z.string().optional(),
    availability: z.number().optional(),
    createdAt: z.string().optional(),
    downloadFinished: z.boolean().optional(),
    downloadPresent: z.boolean().optional(),
    downloadSpeed: z.number().optional(),
    downloadState: z.string().optional(),
    eta: z.number().optional(),
    expiresAt: z.string().optional(),
    files: z.array(dataFiles1).optional(),
    hash: z.string().optional(),
    id: z.number().optional(),
    inactiveCheck: z.number().optional(),
    magnet: z.string().optional(),
    name: z.string().optional(),
    peers: z.number().optional(),
    progress: z.number().optional(),
    ratio: z.number().optional(),
    seeds: z.number().optional(),
    server: z.number().optional(),
    size: z.number().optional(),
    torrentFile: z.boolean().optional(),
    updatedAt: z.string().optional(),
    uploadSpeed: z.number().optional(),
  });
});

/**
 *
 * @typedef  {GetTorrentListOkResponseData} getTorrentListOkResponseData
 * @property {boolean}
 * @property {string}
 * @property {number}
 * @property {string}
 * @property {boolean}
 * @property {boolean}
 * @property {number}
 * @property {string}
 * @property {number}
 * @property {string}
 * @property {DataFiles1[]}
 * @property {string}
 * @property {number}
 * @property {number}
 * @property {string}
 * @property {string}
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {boolean}
 * @property {string}
 * @property {number}
 */
export type GetTorrentListOkResponseData = z.infer<typeof getTorrentListOkResponseData>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const getTorrentListOkResponseDataResponse = z.lazy(() => {
  return z
    .object({
      active: z.boolean().optional(),
      auth_id: z.string().optional(),
      availability: z.number().optional(),
      created_at: z.string().optional(),
      download_finished: z.boolean().optional(),
      download_present: z.boolean().optional(),
      download_speed: z.number().optional(),
      download_state: z.string().optional(),
      eta: z.number().optional(),
      expires_at: z.string().optional(),
      files: z.array(dataFiles1Response).optional(),
      hash: z.string().optional(),
      id: z.number().optional(),
      inactive_check: z.number().optional(),
      magnet: z.string().optional(),
      name: z.string().optional(),
      peers: z.number().optional(),
      progress: z.number().optional(),
      ratio: z.number().optional(),
      seeds: z.number().optional(),
      server: z.number().optional(),
      size: z.number().optional(),
      torrent_file: z.boolean().optional(),
      updated_at: z.string().optional(),
      upload_speed: z.number().optional(),
    })
    .transform((data) => ({
      active: data['active'],
      authId: data['auth_id'],
      availability: data['availability'],
      createdAt: data['created_at'],
      downloadFinished: data['download_finished'],
      downloadPresent: data['download_present'],
      downloadSpeed: data['download_speed'],
      downloadState: data['download_state'],
      eta: data['eta'],
      expiresAt: data['expires_at'],
      files: data['files'],
      hash: data['hash'],
      id: data['id'],
      inactiveCheck: data['inactive_check'],
      magnet: data['magnet'],
      name: data['name'],
      peers: data['peers'],
      progress: data['progress'],
      ratio: data['ratio'],
      seeds: data['seeds'],
      server: data['server'],
      size: data['size'],
      torrentFile: data['torrent_file'],
      updatedAt: data['updated_at'],
      uploadSpeed: data['upload_speed'],
    }));
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const getTorrentListOkResponseDataRequest = z.lazy(() => {
  return z
    .object({
      active: z.boolean().nullish(),
      authId: z.string().nullish(),
      availability: z.number().nullish(),
      createdAt: z.string().nullish(),
      downloadFinished: z.boolean().nullish(),
      downloadPresent: z.boolean().nullish(),
      downloadSpeed: z.number().nullish(),
      downloadState: z.string().nullish(),
      eta: z.number().nullish(),
      expiresAt: z.string().nullish(),
      files: z.array(dataFiles1Request).nullish(),
      hash: z.string().nullish(),
      id: z.number().nullish(),
      inactiveCheck: z.number().nullish(),
      magnet: z.string().nullish(),
      name: z.string().nullish(),
      peers: z.number().nullish(),
      progress: z.number().nullish(),
      ratio: z.number().nullish(),
      seeds: z.number().nullish(),
      server: z.number().nullish(),
      size: z.number().nullish(),
      torrentFile: z.boolean().nullish(),
      updatedAt: z.string().nullish(),
      uploadSpeed: z.number().nullish(),
    })
    .transform((data) => ({
      active: data['active'],
      auth_id: data['authId'],
      availability: data['availability'],
      created_at: data['createdAt'],
      download_finished: data['downloadFinished'],
      download_present: data['downloadPresent'],
      download_speed: data['downloadSpeed'],
      download_state: data['downloadState'],
      eta: data['eta'],
      expires_at: data['expiresAt'],
      files: data['files'],
      hash: data['hash'],
      id: data['id'],
      inactive_check: data['inactiveCheck'],
      magnet: data['magnet'],
      name: data['name'],
      peers: data['peers'],
      progress: data['progress'],
      ratio: data['ratio'],
      seeds: data['seeds'],
      server: data['server'],
      size: data['size'],
      torrent_file: data['torrentFile'],
      updated_at: data['updatedAt'],
      upload_speed: data['uploadSpeed'],
    }));
});

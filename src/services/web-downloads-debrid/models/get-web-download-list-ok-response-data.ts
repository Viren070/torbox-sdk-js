import { z } from 'zod';
import { DataFiles4, dataFiles4, dataFiles4Request, dataFiles4Response } from './data-files-4';

/**
 * The shape of the model inside the application code - what the users use
 */
export const getWebDownloadListOkResponseData = z.lazy(() => {
  return z.object({
    active: z.boolean().optional(),
    authId: z.string().optional(),
    availability: z.number().optional(),
    createdAt: z.string().optional(),
    downloadFinished: z.boolean().optional(),
    downloadPresent: z.boolean().optional(),
    downloadSpeed: z.number().optional(),
    downloadState: z.string().optional(),
    error: z.string().optional(),
    eta: z.number().optional(),
    expiresAt: z.string().optional(),
    files: z.array(dataFiles4).optional(),
    hash: z.string().optional(),
    id: z.number().optional(),
    inactiveCheck: z.number().optional(),
    name: z.string().optional(),
    progress: z.number().optional(),
    server: z.number().optional(),
    size: z.number().optional(),
    torrentFile: z.boolean().optional(),
    updatedAt: z.string().optional(),
    uploadSpeed: z.number().optional(),
  });
});

/**
 *
 * @typedef  {GetWebDownloadListOkResponseData} getWebDownloadListOkResponseData
 * @property {boolean}
 * @property {string}
 * @property {number}
 * @property {string}
 * @property {boolean}
 * @property {boolean}
 * @property {number}
 * @property {string}
 * @property {string}
 * @property {number}
 * @property {string}
 * @property {DataFiles4[]}
 * @property {string}
 * @property {number}
 * @property {number}
 * @property {string}
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {boolean}
 * @property {string}
 * @property {number}
 */
export type GetWebDownloadListOkResponseData = z.infer<typeof getWebDownloadListOkResponseData>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const getWebDownloadListOkResponseDataResponse = z.lazy(() => {
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
      error: z.string().optional(),
      eta: z.number().optional(),
      expires_at: z.string().optional(),
      files: z.array(dataFiles4Response).optional(),
      hash: z.string().optional(),
      id: z.number().optional(),
      inactive_check: z.number().optional(),
      name: z.string().optional(),
      progress: z.number().optional(),
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
      error: data['error'],
      eta: data['eta'],
      expiresAt: data['expires_at'],
      files: data['files'],
      hash: data['hash'],
      id: data['id'],
      inactiveCheck: data['inactive_check'],
      name: data['name'],
      progress: data['progress'],
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
export const getWebDownloadListOkResponseDataRequest = z.lazy(() => {
  return z
    .object({
      active: z.boolean().optional(),
      authId: z.string().optional(),
      availability: z.number().optional(),
      createdAt: z.string().optional(),
      downloadFinished: z.boolean().optional(),
      downloadPresent: z.boolean().optional(),
      downloadSpeed: z.number().optional(),
      downloadState: z.string().optional(),
      error: z.string().optional(),
      eta: z.number().optional(),
      expiresAt: z.string().optional(),
      files: z.array(dataFiles4Request).optional(),
      hash: z.string().optional(),
      id: z.number().optional(),
      inactiveCheck: z.number().optional(),
      name: z.string().optional(),
      progress: z.number().optional(),
      server: z.number().optional(),
      size: z.number().optional(),
      torrentFile: z.boolean().optional(),
      updatedAt: z.string().optional(),
      uploadSpeed: z.number().optional(),
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
      error: data['error'],
      eta: data['eta'],
      expires_at: data['expiresAt'],
      files: data['files'],
      hash: data['hash'],
      id: data['id'],
      inactive_check: data['inactiveCheck'],
      name: data['name'],
      progress: data['progress'],
      server: data['server'],
      size: data['size'],
      torrent_file: data['torrentFile'],
      updated_at: data['updatedAt'],
      upload_speed: data['uploadSpeed'],
    }));
});

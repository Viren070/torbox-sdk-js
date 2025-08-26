import { z } from 'zod';
import { DataFiles4, dataFiles4, dataFiles4Request, dataFiles4Response } from './data-files-4';

/**
 * The shape of the model inside the application code - what the users use
 */
export const getUsenetListOkResponseData = z.lazy(() => {
  return z.object({
    active: z.boolean().optional().nullable(),
    authId: z.string().optional().nullable(),
    availability: z.number().optional().nullable(),
    createdAt: z.string().optional().nullable(),
    downloadFinished: z.boolean().optional().nullable(),
    downloadPresent: z.boolean().optional().nullable(),
    downloadSpeed: z.number().optional().nullable(),
    downloadState: z.string().optional().nullable(),
    eta: z.number().optional().nullable(),
    expiresAt: z.string().optional().nullable(),
    files: z.array(dataFiles4).optional().nullable(),
    hash: z.string().optional().nullable(),
    id: z.number().optional().nullable(),
    inactiveCheck: z.number().optional().nullable(),
    name: z.string().optional().nullable(),
    progress: z.number().optional().nullable(),
    server: z.number().optional().nullable(),
    size: z.number().optional().nullable(),
    torrentFile: z.boolean().optional().nullable(),
    updatedAt: z.string().optional().nullable(),
    uploadSpeed: z.number().optional().nullable(),
  });
});

/**
 *
 * @typedef  {GetUsenetListOkResponseData} getUsenetListOkResponseData
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
export type GetUsenetListOkResponseData = z.infer<typeof getUsenetListOkResponseData>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const getUsenetListOkResponseDataResponse = z.lazy(() => {
  return z
    .object({
      active: z.boolean().optional().nullable(),
      auth_id: z.string().optional().nullable(),
      availability: z.number().optional().nullable(),
      created_at: z.string().optional().nullable(),
      download_finished: z.boolean().optional().nullable(),
      download_present: z.boolean().optional().nullable(),
      download_speed: z.number().optional().nullable(),
      download_state: z.string().optional().nullable(),
      eta: z.number().optional().nullable(),
      expires_at: z.string().optional().nullable(),
      files: z.array(dataFiles4Response).optional().nullable(),
      hash: z.string().optional().nullable(),
      id: z.number().optional().nullable(),
      inactive_check: z.number().optional().nullable(),
      name: z.string().optional().nullable(),
      progress: z.number().optional().nullable(),
      server: z.number().optional().nullable(),
      size: z.number().optional().nullable(),
      torrent_file: z.boolean().optional().nullable(),
      updated_at: z.string().optional().nullable(),
      upload_speed: z.number().optional().nullable(),
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
export const getUsenetListOkResponseDataRequest = z.lazy(() => {
  return z
    .object({
      active: z.boolean().optional().nullable(),
      authId: z.string().optional().nullable(),
      availability: z.number().optional().nullable(),
      createdAt: z.string().optional().nullable(),
      downloadFinished: z.boolean().optional().nullable(),
      downloadPresent: z.boolean().optional().nullable(),
      downloadSpeed: z.number().optional().nullable(),
      downloadState: z.string().optional().nullable(),
      eta: z.number().optional().nullable(),
      expiresAt: z.string().optional().nullable(),
      files: z.array(dataFiles4Request).optional().nullable(),
      hash: z.string().optional().nullable(),
      id: z.number().optional().nullable(),
      inactiveCheck: z.number().optional().nullable(),
      name: z.string().optional().nullable(),
      progress: z.number().optional().nullable(),
      server: z.number().optional().nullable(),
      size: z.number().optional().nullable(),
      torrentFile: z.boolean().optional().nullable(),
      updatedAt: z.string().optional().nullable(),
      uploadSpeed: z.number().optional().nullable(),
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
      name: data['name'],
      progress: data['progress'],
      server: data['server'],
      size: data['size'],
      torrent_file: data['torrentFile'],
      updated_at: data['updatedAt'],
      upload_speed: data['uploadSpeed'],
    }));
});

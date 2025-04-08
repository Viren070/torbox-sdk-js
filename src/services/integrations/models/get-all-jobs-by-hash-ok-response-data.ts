import { z } from 'zod';

/**
 * The shape of the model inside the application code - what the users use
 */
export const getAllJobsByHashOkResponseData = z.lazy(() => {
  return z.object({
    authId: z.string().optional(),
    createdAt: z.string().optional(),
    detail: z.string().optional(),
    downloadUrl: z.string().optional().nullable(),
    fileId: z.number().optional(),
    hash: z.string().optional(),
    id: z.number().optional(),
    integration: z.string().optional(),
    progress: z.number().optional(),
    status: z.string().optional(),
    type: z.string().optional(),
    updatedAt: z.string().optional(),
    zip: z.boolean().optional(),
  });
});

/**
 *
 * @typedef  {GetAllJobsByHashOkResponseData} getAllJobsByHashOkResponseData
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {number}
 * @property {string}
 * @property {number}
 * @property {string}
 * @property {number}
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {boolean}
 */
export type GetAllJobsByHashOkResponseData = z.infer<typeof getAllJobsByHashOkResponseData>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const getAllJobsByHashOkResponseDataResponse = z.lazy(() => {
  return z
    .object({
      auth_id: z.string().optional(),
      created_at: z.string().optional(),
      detail: z.string().optional(),
      download_url: z.string().optional().nullable(),
      file_id: z.number().optional(),
      hash: z.string().optional(),
      id: z.number().optional(),
      integration: z.string().optional(),
      progress: z.number().optional(),
      status: z.string().optional(),
      type: z.string().optional(),
      updated_at: z.string().optional(),
      zip: z.boolean().optional(),
    })
    .transform((data) => ({
      authId: data['auth_id'],
      createdAt: data['created_at'],
      detail: data['detail'],
      downloadUrl: data['download_url'],
      fileId: data['file_id'],
      hash: data['hash'],
      id: data['id'],
      integration: data['integration'],
      progress: data['progress'],
      status: data['status'],
      type: data['type'],
      updatedAt: data['updated_at'],
      zip: data['zip'],
    }));
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const getAllJobsByHashOkResponseDataRequest = z.lazy(() => {
  return z
    .object({
      authId: z.string().optional(),
      createdAt: z.string().optional(),
      detail: z.string().optional(),
      downloadUrl: z.string().optional().nullable(),
      fileId: z.number().optional(),
      hash: z.string().optional(),
      id: z.number().optional(),
      integration: z.string().optional(),
      progress: z.number().optional(),
      status: z.string().optional(),
      type: z.string().optional(),
      updatedAt: z.string().optional(),
      zip: z.boolean().optional(),
    })
    .transform((data) => ({
      auth_id: data['authId'],
      created_at: data['createdAt'],
      detail: data['detail'],
      download_url: data['downloadUrl'],
      file_id: data['fileId'],
      hash: data['hash'],
      id: data['id'],
      integration: data['integration'],
      progress: data['progress'],
      status: data['status'],
      type: data['type'],
      updated_at: data['updatedAt'],
      zip: data['zip'],
    }));
});

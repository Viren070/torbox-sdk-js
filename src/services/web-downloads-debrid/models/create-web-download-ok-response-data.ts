import { z } from 'zod';

/**
 * The shape of the model inside the application code - what the users use
 */
export const createWebDownloadOkResponseData = z.lazy(() => {
  return z.object({
    authId: z.string().optional(),
    hash: z.string().optional(),
    webdownloadId: z.string().optional(),
  });
});

/**
 *
 * @typedef  {CreateWebDownloadOkResponseData} createWebDownloadOkResponseData
 * @property {string}
 * @property {string}
 * @property {string}
 */
export type CreateWebDownloadOkResponseData = z.infer<typeof createWebDownloadOkResponseData>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const createWebDownloadOkResponseDataResponse = z.lazy(() => {
  return z
    .object({
      auth_id: z.string().optional(),
      hash: z.string().optional(),
      webdownload_id: z.string().optional(),
    })
    .transform((data) => ({
      authId: data['auth_id'],
      hash: data['hash'],
      webdownloadId: data['webdownload_id'],
    }));
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const createWebDownloadOkResponseDataRequest = z.lazy(() => {
  return z
    .object({ authId: z.string().nullish(), hash: z.string().nullish(), webdownloadId: z.string().nullish() })
    .transform((data) => ({
      auth_id: data['authId'],
      hash: data['hash'],
      webdownload_id: data['webdownloadId'],
    }));
});

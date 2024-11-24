import { z } from 'zod';
import {
  createTorrentOkResponseData,
  createTorrentOkResponseDataRequest,
  createTorrentOkResponseDataResponse,
} from './create-torrent-ok-response-data';

/**
 * The shape of the model inside the application code - what the users use
 */
export const createTorrentOkResponse = z.lazy(() => {
  return z.object({
    data: createTorrentOkResponseData.optional(),
    detail: z.string().optional(),
    error: z.any().optional().nullable(),
    success: z.boolean().optional(),
  });
});

/**
 *
 * @typedef  {CreateTorrentOkResponse} createTorrentOkResponse
 * @property {CreateTorrentOkResponseData}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
export type CreateTorrentOkResponse = z.infer<typeof createTorrentOkResponse>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const createTorrentOkResponseResponse = z.lazy(() => {
  return z
    .object({
      data: createTorrentOkResponseDataResponse.optional(),
      detail: z.string().optional(),
      error: z.any().optional().nullable(),
      success: z.boolean().optional(),
    })
    .transform((data) => ({
      data: data['data'],
      detail: data['detail'],
      error: data['error'],
      success: data['success'],
    }));
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const createTorrentOkResponseRequest = z.lazy(() => {
  return z
    .object({
      data: createTorrentOkResponseDataRequest.nullish(),
      detail: z.string().nullish(),
      error: z.any().nullish(),
      success: z.boolean().nullish(),
    })
    .transform((data) => ({
      data: data['data'],
      detail: data['detail'],
      error: data['error'],
      success: data['success'],
    }));
});

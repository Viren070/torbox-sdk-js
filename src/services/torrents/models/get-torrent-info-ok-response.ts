import { z } from 'zod';
import {
  getTorrentInfoOkResponseData,
  getTorrentInfoOkResponseDataRequest,
  getTorrentInfoOkResponseDataResponse,
} from './get-torrent-info-ok-response-data';

/**
 * The shape of the model inside the application code - what the users use
 */
export const getTorrentInfoOkResponse = z.lazy(() => {
  return z.object({
    data: getTorrentInfoOkResponseData.optional(),
    detail: z.string().optional(),
    error: z.any().optional().nullable(),
    success: z.boolean().optional(),
  });
});

/**
 *
 * @typedef  {GetTorrentInfoOkResponse} getTorrentInfoOkResponse
 * @property {GetTorrentInfoOkResponseData}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
export type GetTorrentInfoOkResponse = z.infer<typeof getTorrentInfoOkResponse>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const getTorrentInfoOkResponseResponse = z.lazy(() => {
  return z
    .object({
      data: getTorrentInfoOkResponseDataResponse.optional(),
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
export const getTorrentInfoOkResponseRequest = z.lazy(() => {
  return z
    .object({
      data: getTorrentInfoOkResponseDataRequest.nullish(),
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

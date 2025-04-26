import { z } from 'zod';
import {
  GetTorrentInfo1OkResponseData,
  getTorrentInfo1OkResponseData,
  getTorrentInfo1OkResponseDataRequest,
  getTorrentInfo1OkResponseDataResponse,
} from './get-torrent-info1-ok-response-data';

/**
 * The shape of the model inside the application code - what the users use
 */
export const getTorrentInfo1OkResponse = z.lazy(() => {
  return z.object({
    data: getTorrentInfo1OkResponseData.optional(),
    detail: z.string().optional(),
    error: z.any().optional().nullable(),
    success: z.boolean().optional(),
  });
});

/**
 *
 * @typedef  {GetTorrentInfo1OkResponse} getTorrentInfo1OkResponse
 * @property {GetTorrentInfo1OkResponseData}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
export type GetTorrentInfo1OkResponse = z.infer<typeof getTorrentInfo1OkResponse>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const getTorrentInfo1OkResponseResponse = z.lazy(() => {
  return z
    .object({
      data: getTorrentInfo1OkResponseDataResponse.optional(),
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
export const getTorrentInfo1OkResponseRequest = z.lazy(() => {
  return z
    .object({
      data: getTorrentInfo1OkResponseDataRequest.optional(),
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

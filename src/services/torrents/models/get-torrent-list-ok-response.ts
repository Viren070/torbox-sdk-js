import { z } from 'zod';
import {
  getTorrentListOkResponseData,
  getTorrentListOkResponseDataRequest,
  getTorrentListOkResponseDataResponse,
} from './get-torrent-list-ok-response-data';

/**
 * The shape of the model inside the application code - what the users use
 */
export const getTorrentListOkResponse = z.lazy(() => {
  return z.object({
    data: z.array(getTorrentListOkResponseData).optional(),
    detail: z.string().optional(),
    error: z.any().optional().nullable(),
    success: z.boolean().optional(),
  });
});

/**
 *
 * @typedef  {GetTorrentListOkResponse} getTorrentListOkResponse
 * @property {GetTorrentListOkResponseData[]}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
export type GetTorrentListOkResponse = z.infer<typeof getTorrentListOkResponse>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const getTorrentListOkResponseResponse = z.lazy(() => {
  return z
    .object({
      data: z.array(getTorrentListOkResponseDataResponse).optional(),
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
export const getTorrentListOkResponseRequest = z.lazy(() => {
  return z
    .object({
      data: z.array(getTorrentListOkResponseDataRequest).nullish(),
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

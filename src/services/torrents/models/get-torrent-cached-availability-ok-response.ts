import { z } from 'zod';
import {
  getTorrentCachedAvailabilityOkResponseData,
  getTorrentCachedAvailabilityOkResponseDataRequest,
  getTorrentCachedAvailabilityOkResponseDataResponse,
} from './get-torrent-cached-availability-ok-response-data';

/**
 * The shape of the model inside the application code - what the users use
 */
export const getTorrentCachedAvailabilityOkResponse = z.lazy(() => {
  return z.object({
    data: z.any().optional(),
    detail: z.string().optional(),
    error: z.string().optional().nullable(),
    success: z.boolean().optional(),
  });
});

/**
 *
 * @typedef  {GetTorrentCachedAvailabilityOkResponse} getTorrentCachedAvailabilityOkResponse
 * @property {any}
 * @property {string}
 * @property {string}
 * @property {boolean}
 */
export type GetTorrentCachedAvailabilityOkResponse = z.infer<typeof getTorrentCachedAvailabilityOkResponse>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const getTorrentCachedAvailabilityOkResponseResponse = z.lazy(() => {
  return z
    .object({
      data: z.any().optional(),
      detail: z.string().optional(),
      error: z.string().optional().nullable(),
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
export const getTorrentCachedAvailabilityOkResponseRequest = z.lazy(() => {
  return z
    .object({
      data: z.any().nullish(),
      detail: z.string().nullish(),
      error: z.string().nullish(),
      success: z.boolean().nullish(),
    })
    .transform((data) => ({
      data: data['data'],
      detail: data['detail'],
      error: data['error'],
      success: data['success'],
    }));
});

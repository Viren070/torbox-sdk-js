import { z } from 'zod';
import { data1, data1Request, data1Response } from './data-1';
import { data2, data2Request, data2Response } from './data-2';

/**
 * The shape of the model inside the application code - what the users use
 */
export const getTorrentCachedAvailabilityOkResponseData = z.lazy(() => {
  return z.union([z.array(data1), data2, z.any()]);
});

/**
 *
 * @typedef  {GetTorrentCachedAvailabilityOkResponseData} getTorrentCachedAvailabilityOkResponseData
 * @property {Data1[]}
 * @property {Data2}
 * @property {any}
 */
export type GetTorrentCachedAvailabilityOkResponseData = z.infer<typeof getTorrentCachedAvailabilityOkResponseData>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const getTorrentCachedAvailabilityOkResponseDataResponse = z.lazy(() => {
  return z.union([z.array(data1), data2Response, z.any()]);
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const getTorrentCachedAvailabilityOkResponseDataRequest = z.lazy(() => {
  return z.union([z.array(data1), data2Request, z.any()]);
});

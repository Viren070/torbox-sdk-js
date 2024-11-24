import { z } from 'zod';
import {
  getStatsOkResponseData,
  getStatsOkResponseDataRequest,
  getStatsOkResponseDataResponse,
} from './get-stats-ok-response-data';

/**
 * The shape of the model inside the application code - what the users use
 */
export const getStatsOkResponse = z.lazy(() => {
  return z.object({
    data: getStatsOkResponseData.optional(),
    detail: z.string().optional(),
  });
});

/**
 *
 * @typedef  {GetStatsOkResponse} getStatsOkResponse
 * @property {GetStatsOkResponseData}
 * @property {string}
 */
export type GetStatsOkResponse = z.infer<typeof getStatsOkResponse>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const getStatsOkResponseResponse = z.lazy(() => {
  return z
    .object({
      data: getStatsOkResponseDataResponse.optional(),
      detail: z.string().optional(),
    })
    .transform((data) => ({
      data: data['data'],
      detail: data['detail'],
    }));
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const getStatsOkResponseRequest = z.lazy(() => {
  return z
    .object({ data: getStatsOkResponseDataRequest.nullish(), detail: z.string().nullish() })
    .transform((data) => ({
      data: data['data'],
      detail: data['detail'],
    }));
});

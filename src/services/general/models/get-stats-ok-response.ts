import { z } from 'zod';
import {
  GetStatsOkResponseData,
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
    error: z.boolean().optional(),
    success: z.boolean().optional(),
  });
});

/**
 *
 * @typedef  {GetStatsOkResponse} getStatsOkResponse
 * @property {GetStatsOkResponseData}
 * @property {string}
 * @property {boolean}
 * @property {boolean}
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
      error: z.boolean().optional(),
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
export const getStatsOkResponseRequest = z.lazy(() => {
  return z
    .object({
      data: getStatsOkResponseDataRequest.optional(),
      detail: z.string().optional(),
      error: z.boolean().optional(),
      success: z.boolean().optional(),
    })
    .transform((data) => ({
      data: data['data'],
      detail: data['detail'],
      error: data['error'],
      success: data['success'],
    }));
});

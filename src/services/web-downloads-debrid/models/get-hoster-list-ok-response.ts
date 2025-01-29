import { z } from 'zod';
import {
  getHosterListOkResponseData,
  getHosterListOkResponseDataRequest,
  getHosterListOkResponseDataResponse,
} from './get-hoster-list-ok-response-data';

/**
 * The shape of the model inside the application code - what the users use
 */
export const getHosterListOkResponse = z.lazy(() => {
  return z.object({
    data: z.array(getHosterListOkResponseData).optional(),
    detail: z.string().optional(),
    error: z.any().optional().nullable(),
    success: z.boolean().optional(),
  });
});

/**
 *
 * @typedef  {GetHosterListOkResponse} getHosterListOkResponse
 * @property {GetHosterListOkResponseData[]}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
export type GetHosterListOkResponse = z.infer<typeof getHosterListOkResponse>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const getHosterListOkResponseResponse = z.lazy(() => {
  return z
    .object({
      data: z.array(getHosterListOkResponseDataResponse).optional(),
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
export const getHosterListOkResponseRequest = z.lazy(() => {
  return z
    .object({
      data: z.array(getHosterListOkResponseDataRequest).nullish(),
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

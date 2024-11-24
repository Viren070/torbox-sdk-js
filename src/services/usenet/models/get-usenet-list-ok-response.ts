import { z } from 'zod';
import {
  getUsenetListOkResponseData,
  getUsenetListOkResponseDataRequest,
  getUsenetListOkResponseDataResponse,
} from './get-usenet-list-ok-response-data';

/**
 * The shape of the model inside the application code - what the users use
 */
export const getUsenetListOkResponse = z.lazy(() => {
  return z.object({
    data: z.array(getUsenetListOkResponseData).optional(),
    detail: z.string().optional(),
    error: z.any().optional().nullable(),
    success: z.boolean().optional(),
  });
});

/**
 *
 * @typedef  {GetUsenetListOkResponse} getUsenetListOkResponse
 * @property {GetUsenetListOkResponseData[]}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
export type GetUsenetListOkResponse = z.infer<typeof getUsenetListOkResponse>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const getUsenetListOkResponseResponse = z.lazy(() => {
  return z
    .object({
      data: z.array(getUsenetListOkResponseDataResponse).optional(),
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
export const getUsenetListOkResponseRequest = z.lazy(() => {
  return z
    .object({
      data: z.array(getUsenetListOkResponseDataRequest).nullish(),
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

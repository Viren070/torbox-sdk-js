import { z } from 'zod';
import {
  getUserDataOkResponseData,
  getUserDataOkResponseDataRequest,
  getUserDataOkResponseDataResponse,
} from './get-user-data-ok-response-data';

/**
 * The shape of the model inside the application code - what the users use
 */
export const getUserDataOkResponse = z.lazy(() => {
  return z.object({
    data: getUserDataOkResponseData.optional(),
    detail: z.string().optional(),
    success: z.boolean().optional(),
  });
});

/**
 *
 * @typedef  {GetUserDataOkResponse} getUserDataOkResponse
 * @property {GetUserDataOkResponseData}
 * @property {string}
 * @property {boolean}
 */
export type GetUserDataOkResponse = z.infer<typeof getUserDataOkResponse>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const getUserDataOkResponseResponse = z.lazy(() => {
  return z
    .object({
      data: getUserDataOkResponseDataResponse.optional(),
      detail: z.string().optional(),
      success: z.boolean().optional(),
    })
    .transform((data) => ({
      data: data['data'],
      detail: data['detail'],
      success: data['success'],
    }));
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const getUserDataOkResponseRequest = z.lazy(() => {
  return z
    .object({
      data: getUserDataOkResponseDataRequest.nullish(),
      detail: z.string().nullish(),
      success: z.boolean().nullish(),
    })
    .transform((data) => ({
      data: data['data'],
      detail: data['detail'],
      success: data['success'],
    }));
});

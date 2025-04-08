import { z } from 'zod';
import {
  GetUserDataOkResponseData,
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
    error: z.any().optional().nullable(),
    success: z.boolean().optional(),
  });
});

/**
 *
 * @typedef  {GetUserDataOkResponse} getUserDataOkResponse
 * @property {GetUserDataOkResponseData}
 * @property {string}
 * @property {any}
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
export const getUserDataOkResponseRequest = z.lazy(() => {
  return z
    .object({
      data: getUserDataOkResponseDataRequest.optional(),
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

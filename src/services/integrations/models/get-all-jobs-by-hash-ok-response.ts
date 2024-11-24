import { z } from 'zod';
import {
  getAllJobsByHashOkResponseData,
  getAllJobsByHashOkResponseDataRequest,
  getAllJobsByHashOkResponseDataResponse,
} from './get-all-jobs-by-hash-ok-response-data';

/**
 * The shape of the model inside the application code - what the users use
 */
export const getAllJobsByHashOkResponse = z.lazy(() => {
  return z.object({
    data: z.array(getAllJobsByHashOkResponseData).optional(),
    detail: z.string().optional(),
    success: z.boolean().optional(),
  });
});

/**
 *
 * @typedef  {GetAllJobsByHashOkResponse} getAllJobsByHashOkResponse
 * @property {GetAllJobsByHashOkResponseData[]}
 * @property {string}
 * @property {boolean}
 */
export type GetAllJobsByHashOkResponse = z.infer<typeof getAllJobsByHashOkResponse>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const getAllJobsByHashOkResponseResponse = z.lazy(() => {
  return z
    .object({
      data: z.array(getAllJobsByHashOkResponseDataResponse).optional(),
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
export const getAllJobsByHashOkResponseRequest = z.lazy(() => {
  return z
    .object({
      data: z.array(getAllJobsByHashOkResponseDataRequest).nullish(),
      detail: z.string().nullish(),
      success: z.boolean().nullish(),
    })
    .transform((data) => ({
      data: data['data'],
      detail: data['detail'],
      success: data['success'],
    }));
});

import { z } from 'zod';
import {
  getAllJobsOkResponseData,
  getAllJobsOkResponseDataRequest,
  getAllJobsOkResponseDataResponse,
} from './get-all-jobs-ok-response-data';

/**
 * The shape of the model inside the application code - what the users use
 */
export const getAllJobsOkResponse = z.lazy(() => {
  return z.object({
    data: z.array(getAllJobsOkResponseData).optional(),
    detail: z.string().optional(),
    error: z.any().optional().nullable(),
    success: z.boolean().optional(),
  });
});

/**
 *
 * @typedef  {GetAllJobsOkResponse} getAllJobsOkResponse
 * @property {GetAllJobsOkResponseData[]}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
export type GetAllJobsOkResponse = z.infer<typeof getAllJobsOkResponse>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const getAllJobsOkResponseResponse = z.lazy(() => {
  return z
    .object({
      data: z.array(getAllJobsOkResponseDataResponse).optional(),
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
export const getAllJobsOkResponseRequest = z.lazy(() => {
  return z
    .object({
      data: z.array(getAllJobsOkResponseDataRequest).nullish(),
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

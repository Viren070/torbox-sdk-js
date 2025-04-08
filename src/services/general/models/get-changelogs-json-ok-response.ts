import { z } from 'zod';
import {
  GetChangelogsJsonOkResponseData,
  getChangelogsJsonOkResponseData,
  getChangelogsJsonOkResponseDataRequest,
  getChangelogsJsonOkResponseDataResponse,
} from './get-changelogs-json-ok-response-data';

/**
 * The shape of the model inside the application code - what the users use
 */
export const getChangelogsJsonOkResponse = z.lazy(() => {
  return z.object({
    data: z.array(getChangelogsJsonOkResponseData).optional(),
    detail: z.string().optional(),
    error: z.any().optional().nullable(),
    success: z.boolean().optional(),
  });
});

/**
 *
 * @typedef  {GetChangelogsJsonOkResponse} getChangelogsJsonOkResponse
 * @property {GetChangelogsJsonOkResponseData[]}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
export type GetChangelogsJsonOkResponse = z.infer<typeof getChangelogsJsonOkResponse>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const getChangelogsJsonOkResponseResponse = z.lazy(() => {
  return z
    .object({
      data: z.array(getChangelogsJsonOkResponseDataResponse).optional(),
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
export const getChangelogsJsonOkResponseRequest = z.lazy(() => {
  return z
    .object({
      data: z.array(getChangelogsJsonOkResponseDataRequest).optional(),
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

import { z } from 'zod';
import {
  CreateWebDownloadOkResponseData,
  createWebDownloadOkResponseData,
  createWebDownloadOkResponseDataRequest,
  createWebDownloadOkResponseDataResponse,
} from './create-web-download-ok-response-data';

/**
 * The shape of the model inside the application code - what the users use
 */
export const createWebDownloadOkResponse = z.lazy(() => {
  return z.object({
    data: createWebDownloadOkResponseData.optional(),
    detail: z.string().optional(),
    error: z.any().optional().nullable(),
    success: z.boolean().optional(),
  });
});

/**
 *
 * @typedef  {CreateWebDownloadOkResponse} createWebDownloadOkResponse
 * @property {CreateWebDownloadOkResponseData}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
export type CreateWebDownloadOkResponse = z.infer<typeof createWebDownloadOkResponse>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const createWebDownloadOkResponseResponse = z.lazy(() => {
  return z
    .object({
      data: createWebDownloadOkResponseDataResponse.optional(),
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
export const createWebDownloadOkResponseRequest = z.lazy(() => {
  return z
    .object({
      data: createWebDownloadOkResponseDataRequest.optional(),
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

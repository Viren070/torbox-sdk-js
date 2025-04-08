import { z } from 'zod';
import {
  CreateUsenetDownloadOkResponseData,
  createUsenetDownloadOkResponseData,
  createUsenetDownloadOkResponseDataRequest,
  createUsenetDownloadOkResponseDataResponse,
} from './create-usenet-download-ok-response-data';

/**
 * The shape of the model inside the application code - what the users use
 */
export const createUsenetDownloadOkResponse = z.lazy(() => {
  return z.object({
    data: createUsenetDownloadOkResponseData.optional(),
    detail: z.string().optional(),
    error: z.any().optional().nullable(),
    success: z.boolean().optional(),
  });
});

/**
 *
 * @typedef  {CreateUsenetDownloadOkResponse} createUsenetDownloadOkResponse
 * @property {CreateUsenetDownloadOkResponseData}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
export type CreateUsenetDownloadOkResponse = z.infer<typeof createUsenetDownloadOkResponse>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const createUsenetDownloadOkResponseResponse = z.lazy(() => {
  return z
    .object({
      data: createUsenetDownloadOkResponseDataResponse.optional(),
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
export const createUsenetDownloadOkResponseRequest = z.lazy(() => {
  return z
    .object({
      data: createUsenetDownloadOkResponseDataRequest.optional(),
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

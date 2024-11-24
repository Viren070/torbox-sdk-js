import { z } from 'zod';
import {
  getWebDownloadListOkResponseData,
  getWebDownloadListOkResponseDataRequest,
  getWebDownloadListOkResponseDataResponse,
} from './get-web-download-list-ok-response-data';

/**
 * The shape of the model inside the application code - what the users use
 */
export const getWebDownloadListOkResponse = z.lazy(() => {
  return z.object({
    data: z.array(getWebDownloadListOkResponseData).optional(),
    detail: z.string().optional(),
  });
});

/**
 *
 * @typedef  {GetWebDownloadListOkResponse} getWebDownloadListOkResponse
 * @property {GetWebDownloadListOkResponseData[]}
 * @property {string}
 */
export type GetWebDownloadListOkResponse = z.infer<typeof getWebDownloadListOkResponse>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const getWebDownloadListOkResponseResponse = z.lazy(() => {
  return z
    .object({
      data: z.array(getWebDownloadListOkResponseDataResponse).optional(),
      detail: z.string().optional(),
    })
    .transform((data) => ({
      data: data['data'],
      detail: data['detail'],
    }));
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const getWebDownloadListOkResponseRequest = z.lazy(() => {
  return z
    .object({ data: z.array(getWebDownloadListOkResponseDataRequest).nullish(), detail: z.string().nullish() })
    .transform((data) => ({
      data: data['data'],
      detail: data['detail'],
    }));
});

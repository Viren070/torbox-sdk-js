import { z } from 'zod';
import {
  getNotificationFeedOkResponseData,
  getNotificationFeedOkResponseDataRequest,
  getNotificationFeedOkResponseDataResponse,
} from './get-notification-feed-ok-response-data';

/**
 * The shape of the model inside the application code - what the users use
 */
export const getNotificationFeedOkResponse = z.lazy(() => {
  return z.object({
    data: z.array(getNotificationFeedOkResponseData).optional(),
    detail: z.string().optional(),
    error: z.any().optional().nullable(),
    success: z.boolean().optional(),
  });
});

/**
 *
 * @typedef  {GetNotificationFeedOkResponse} getNotificationFeedOkResponse
 * @property {GetNotificationFeedOkResponseData[]}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
export type GetNotificationFeedOkResponse = z.infer<typeof getNotificationFeedOkResponse>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const getNotificationFeedOkResponseResponse = z.lazy(() => {
  return z
    .object({
      data: z.array(getNotificationFeedOkResponseDataResponse).optional(),
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
export const getNotificationFeedOkResponseRequest = z.lazy(() => {
  return z
    .object({
      data: z.array(getNotificationFeedOkResponseDataRequest).nullish(),
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

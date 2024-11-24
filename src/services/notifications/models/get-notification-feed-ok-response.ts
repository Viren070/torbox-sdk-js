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
  });
});

/**
 *
 * @typedef  {GetNotificationFeedOkResponse} getNotificationFeedOkResponse
 * @property {GetNotificationFeedOkResponseData[]}
 * @property {string}
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
export const getNotificationFeedOkResponseRequest = z.lazy(() => {
  return z
    .object({ data: z.array(getNotificationFeedOkResponseDataRequest).nullish(), detail: z.string().nullish() })
    .transform((data) => ({
      data: data['data'],
      detail: data['detail'],
    }));
});

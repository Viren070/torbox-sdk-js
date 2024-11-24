import { z } from 'zod';

/**
 * The shape of the model inside the application code - what the users use
 */
export const getNotificationFeedOkResponseData = z.lazy(() => {
  return z.object({
    authId: z.string().optional(),
    createdAt: z.string().optional(),
    id: z.number().optional(),
    message: z.string().optional(),
    title: z.string().optional(),
  });
});

/**
 *
 * @typedef  {GetNotificationFeedOkResponseData} getNotificationFeedOkResponseData
 * @property {string}
 * @property {string}
 * @property {number}
 * @property {string}
 * @property {string}
 */
export type GetNotificationFeedOkResponseData = z.infer<typeof getNotificationFeedOkResponseData>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const getNotificationFeedOkResponseDataResponse = z.lazy(() => {
  return z
    .object({
      auth_id: z.string().optional(),
      created_at: z.string().optional(),
      id: z.number().optional(),
      message: z.string().optional(),
      title: z.string().optional(),
    })
    .transform((data) => ({
      authId: data['auth_id'],
      createdAt: data['created_at'],
      id: data['id'],
      message: data['message'],
      title: data['title'],
    }));
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const getNotificationFeedOkResponseDataRequest = z.lazy(() => {
  return z
    .object({
      authId: z.string().nullish(),
      createdAt: z.string().nullish(),
      id: z.number().nullish(),
      message: z.string().nullish(),
      title: z.string().nullish(),
    })
    .transform((data) => ({
      auth_id: data['authId'],
      created_at: data['createdAt'],
      id: data['id'],
      message: data['message'],
      title: data['title'],
    }));
});

import { z } from 'zod';
import { settings, settingsRequest, settingsResponse } from './settings';

/**
 * The shape of the model inside the application code - what the users use
 */
export const getUserDataOkResponseData = z.lazy(() => {
  return z.object({
    authId: z.string().optional(),
    baseEmail: z.string().optional(),
    cooldownUntil: z.string().optional(),
    createdAt: z.string().optional(),
    customer: z.string().optional(),
    email: z.string().optional(),
    id: z.number().optional(),
    isSubscribed: z.boolean().optional(),
    plan: z.number().optional(),
    premiumExpiresAt: z.string().optional(),
    server: z.number().optional(),
    settings: settings.optional(),
    totalDownloaded: z.number().optional(),
    updatedAt: z.string().optional(),
    userReferral: z.string().optional(),
  });
});

/**
 *
 * @typedef  {GetUserDataOkResponseData} getUserDataOkResponseData
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {number}
 * @property {boolean}
 * @property {number}
 * @property {string}
 * @property {number}
 * @property {Settings}
 * @property {number}
 * @property {string}
 * @property {string}
 */
export type GetUserDataOkResponseData = z.infer<typeof getUserDataOkResponseData>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const getUserDataOkResponseDataResponse = z.lazy(() => {
  return z
    .object({
      auth_id: z.string().optional(),
      base_email: z.string().optional(),
      cooldown_until: z.string().optional(),
      created_at: z.string().optional(),
      customer: z.string().optional(),
      email: z.string().optional(),
      id: z.number().optional(),
      is_subscribed: z.boolean().optional(),
      plan: z.number().optional(),
      premium_expires_at: z.string().optional(),
      server: z.number().optional(),
      settings: settingsResponse.optional(),
      total_downloaded: z.number().optional(),
      updated_at: z.string().optional(),
      user_referral: z.string().optional(),
    })
    .transform((data) => ({
      authId: data['auth_id'],
      baseEmail: data['base_email'],
      cooldownUntil: data['cooldown_until'],
      createdAt: data['created_at'],
      customer: data['customer'],
      email: data['email'],
      id: data['id'],
      isSubscribed: data['is_subscribed'],
      plan: data['plan'],
      premiumExpiresAt: data['premium_expires_at'],
      server: data['server'],
      settings: data['settings'],
      totalDownloaded: data['total_downloaded'],
      updatedAt: data['updated_at'],
      userReferral: data['user_referral'],
    }));
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const getUserDataOkResponseDataRequest = z.lazy(() => {
  return z
    .object({
      authId: z.string().nullish(),
      baseEmail: z.string().nullish(),
      cooldownUntil: z.string().nullish(),
      createdAt: z.string().nullish(),
      customer: z.string().nullish(),
      email: z.string().nullish(),
      id: z.number().nullish(),
      isSubscribed: z.boolean().nullish(),
      plan: z.number().nullish(),
      premiumExpiresAt: z.string().nullish(),
      server: z.number().nullish(),
      settings: settingsRequest.nullish(),
      totalDownloaded: z.number().nullish(),
      updatedAt: z.string().nullish(),
      userReferral: z.string().nullish(),
    })
    .transform((data) => ({
      auth_id: data['authId'],
      base_email: data['baseEmail'],
      cooldown_until: data['cooldownUntil'],
      created_at: data['createdAt'],
      customer: data['customer'],
      email: data['email'],
      id: data['id'],
      is_subscribed: data['isSubscribed'],
      plan: data['plan'],
      premium_expires_at: data['premiumExpiresAt'],
      server: data['server'],
      settings: data['settings'],
      total_downloaded: data['totalDownloaded'],
      updated_at: data['updatedAt'],
      user_referral: data['userReferral'],
    }));
});

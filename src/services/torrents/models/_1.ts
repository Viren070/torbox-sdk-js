import { z } from 'zod';

/**
 * The shape of the model inside the application code - what the users use
 */
export const _1 = z.lazy(() => {
  return z.object({
    cooldownUntil: z.string().optional(),
    currentDownloads: z.number().optional(),
    currentTime: z.string().optional(),
    monthlyLimit: z.number().optional(),
  });
});

/**
 *
 * @typedef  {_1} _1
 * @property {string}
 * @property {number}
 * @property {string}
 * @property {number}
 */
export type _1 = z.infer<typeof _1>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const _1Response = z.lazy(() => {
  return z
    .object({
      cooldown_until: z.string().optional(),
      current_downloads: z.number().optional(),
      current_time: z.string().optional(),
      monthly_limit: z.number().optional(),
    })
    .transform((data) => ({
      cooldownUntil: data['cooldown_until'],
      currentDownloads: data['current_downloads'],
      currentTime: data['current_time'],
      monthlyLimit: data['monthly_limit'],
    }));
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const _1Request = z.lazy(() => {
  return z
    .object({
      cooldownUntil: z.string().optional(),
      currentDownloads: z.number().optional(),
      currentTime: z.string().optional(),
      monthlyLimit: z.number().optional(),
    })
    .transform((data) => ({
      cooldown_until: data['cooldownUntil'],
      current_downloads: data['currentDownloads'],
      current_time: data['currentTime'],
      monthly_limit: data['monthlyLimit'],
    }));
});

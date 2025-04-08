import { z } from 'zod';

/**
 * The shape of the model inside the application code - what the users use
 */
export const settings = z.lazy(() => {
  return z.object({
    anothersetting: z.string().optional(),
    setting: z.string().optional(),
  });
});

/**
 *
 * @typedef  {Settings} settings
 * @property {string}
 * @property {string}
 */
export type Settings = z.infer<typeof settings>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const settingsResponse = z.lazy(() => {
  return z
    .object({
      anothersetting: z.string().optional(),
      setting: z.string().optional(),
    })
    .transform((data) => ({
      anothersetting: data['anothersetting'],
      setting: data['setting'],
    }));
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const settingsRequest = z.lazy(() => {
  return z
    .object({
      anothersetting: z.string().optional(),
      setting: z.string().optional(),
    })
    .transform((data) => ({
      anothersetting: data['anothersetting'],
      setting: data['setting'],
    }));
});

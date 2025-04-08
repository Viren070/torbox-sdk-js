import { z } from 'zod';

/**
 * The shape of the model inside the application code - what the users use
 */
export const _14 = z.lazy(() => {
  return z.object({
    data: z.string().optional(),
    detail: z.string().optional(),
  });
});

/**
 *
 * @typedef  {_14} _14
 * @property {string}
 * @property {string}
 */
export type _14 = z.infer<typeof _14>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const _14Response = z.lazy(() => {
  return z
    .object({
      data: z.string().optional(),
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
export const _14Request = z.lazy(() => {
  return z
    .object({
      data: z.string().optional(),
      detail: z.string().optional(),
    })
    .transform((data) => ({
      data: data['data'],
      detail: data['detail'],
    }));
});

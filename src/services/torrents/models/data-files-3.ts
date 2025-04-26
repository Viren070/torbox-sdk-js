import { z } from 'zod';

/**
 * The shape of the model inside the application code - what the users use
 */
export const dataFiles3 = z.lazy(() => {
  return z.object({
    name: z.string().optional(),
    size: z.number().optional(),
  });
});

/**
 *
 * @typedef  {DataFiles3} dataFiles3
 * @property {string}
 * @property {number}
 */
export type DataFiles3 = z.infer<typeof dataFiles3>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const dataFiles3Response = z.lazy(() => {
  return z
    .object({
      name: z.string().optional(),
      size: z.number().optional(),
    })
    .transform((data) => ({
      name: data['name'],
      size: data['size'],
    }));
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const dataFiles3Request = z.lazy(() => {
  return z
    .object({
      name: z.string().optional(),
      size: z.number().optional(),
    })
    .transform((data) => ({
      name: data['name'],
      size: data['size'],
    }));
});

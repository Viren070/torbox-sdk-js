import { z } from 'zod';

/**
 * The shape of the model inside the application code - what the users use
 */
export const dataFiles2 = z.lazy(() => {
  return z.object({
    name: z.string().optional(),
    size: z.number().optional(),
  });
});

/**
 *
 * @typedef  {DataFiles2} dataFiles2
 * @property {string}
 * @property {number}
 */
export type DataFiles2 = z.infer<typeof dataFiles2>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const dataFiles2Response = z.lazy(() => {
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
export const dataFiles2Request = z.lazy(() => {
  return z.object({ name: z.string().nullish(), size: z.number().nullish() }).transform((data) => ({
    name: data['name'],
    size: data['size'],
  }));
});
